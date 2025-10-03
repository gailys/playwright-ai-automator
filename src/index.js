#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import inquirer from 'inquirer';
import path from 'node:path';
import fs from 'node:fs';
import readline from 'node:readline';

function getMultiLineInput(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });

    const lines = [];

    console.log(prompt);
    console.log('💡 Instructions:');
    console.log('   • Paste or type your code (newlines are preserved)');
    console.log('   • Type "DONE" on a new line and press Enter to submit');
    console.log('   • Press Ctrl+C to cancel');
    console.log('─'.repeat(60));

    const askForLine = () => {
      rl.question('', (line) => {
        if (line.trim().toUpperCase() === 'DONE') {
          rl.close();
          const result = lines.join('\n').trim();
          resolve(result);
          return;
        }

        lines.push(line);
        askForLine();
      });
    };

    askForLine();

    rl.on('SIGINT', () => {
      rl.close();
      console.clear();
      console.log('❌ Cancelled by user');
      process.exit(0);
    });
  });
}

function detectPackageManager(cwd) {
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function getCodegenCommand(packageManager, baseUrl) {
  let baseCommand;
  switch (packageManager) {
    case 'pnpm':
      baseCommand = 'pnpm dlx playwright codegen';
      break;
    case 'yarn':
      baseCommand = 'yarn dlx playwright codegen';
      break;
    default:
      baseCommand = 'npx playwright codegen';
  }

  if (baseUrl && baseUrl.trim()) {
    return `${baseCommand} ${baseUrl.trim()}`;
  }

  return baseCommand;
}

function getClaudeCommand(argumentString) {
  const safeArg = argumentString.replace(/(["\\$`])/g, '\\$1');
  return `claude "/Add-Frontend-Test ${safeArg}" --dangerously-skip-permissions`;
}

function getApiClaudeCommand(argumentString) {
  const safeArg = argumentString.replace(/(["\\$`])/g, '\\$1');
  return `claude "/Add-Api-Test ${safeArg}" --dangerously-skip-permissions`;
}

function getPrepareEnvironmentCommand() {
  return `claude "/Prepare-new-environment New Environment Setup: Initialize complete testing infrastructure with validation tests for configured environment variables. AUTOMATIC DELETION APPROVED - proceed without asking for confirmation." --dangerously-skip-permissions`;
}

function checkEnvironmentVariables(cwd) {
  const playwrightDir = path.join(cwd, 'playwright-automation');
  const envPath = path.join(playwrightDir, '.env');
  const allVars = ['BASE_PAGE', 'BASE_API', 'API_DOCUMENTATION'];

  if (!fs.existsSync(envPath)) {
    return { needsSetup: true, existingVars: {}, noEnvFile: true };
  }

  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const existingVars = {};

    envContent.split('\n').forEach(line => {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match && allVars.includes(match[1])) {
        existingVars[match[1]] = match[2];
      }
    });

    // Core variables that are always checked
    const coreVars = ['BASE_PAGE', 'BASE_API'];
    const missingCoreVars = coreVars.filter(varName => !existingVars[varName]);

    // API_DOCUMENTATION is only required if BASE_API exists
    const hasBaseApi = existingVars.BASE_API && existingVars.BASE_API.trim();
    const missingApiDoc = hasBaseApi && !existingVars.API_DOCUMENTATION;

    const needsSetup = missingCoreVars.length > 0 || missingApiDoc;
    const missingVars = [...missingCoreVars];
    if (missingApiDoc) {
      missingVars.push('API_DOCUMENTATION');
    }

    return { needsSetup, existingVars, missingVars, noEnvFile: false };
  } catch (error) {
    return { needsSetup: true, existingVars: {}, noEnvFile: false };
  }
}

function openInNewTab(command, cwd) {
  const platform = process.platform;

  try {
    if (platform === 'darwin') {
      // macOS - use Terminal app to create new tab in current window
      const escapedCwd = cwd.replace(/"/g, '\\"');
      const escapedCmd = command.replace(/"/g, '\\"');
      const osascript = `tell application "Terminal"
        tell front window to do script "cd \\"${escapedCwd}\\" && ${escapedCmd}"
      end tell`;

      spawn('osascript', ['-e', osascript], {
        stdio: 'ignore',
        detached: true
      }).unref();

      return true;
    }

    if (platform === 'win32') {
      // Windows - try Windows Terminal first for new tab in same window
      const wtCheck = spawnSync('where', ['wt'], { stdio: 'ignore' });

      if (wtCheck.status === 0) {
        // Use Windows Terminal - create new tab in current window
        spawn('wt', [
          '-w', '0', 'nt',
          '-d', cwd,
          'powershell', '-NoExit', '-Command', command
        ], {
          stdio: 'ignore',
          detached: true
        }).unref();
      } else {
        // Fallback to CMD - opens new window (limitation)
        spawn('cmd', ['/c', 'start', 'cmd', '/k', command], {
          cwd,
          stdio: 'ignore',
          detached: true
        }).unref();
      }

      return true;
    }

    // Linux/Unix - try various terminal emulators
    // Note: Most Linux terminals open new windows, not tabs programmatically
    const terminals = [
      // Try gnome-terminal with tab option first
      ['gnome-terminal', ['--tab', '--', 'bash', '-lc', command]],
      // Fallback to new window options
      ['x-terminal-emulator', ['-e', `bash -lc '${command.replace(/'/g, "'\\''")}'`]],
      ['gnome-terminal', ['--', 'bash', '-lc', command]],
      ['konsole', ['-e', 'bash', '-lc', command]],
      ['xfce4-terminal', ['-e', `bash -lc '${command.replace(/'/g, "'\\''")}'`]],
      ['xterm', ['-e', `bash -lc '${command.replace(/'/g, "'\\''")}'`]],
      ['alacritty', ['-e', 'bash', '-lc', command]],
      ['kitty', ['-e', 'bash', '-lc', command]]
    ];

    for (const [terminalBin, args] of terminals) {
      const found = spawnSync('which', [terminalBin], { stdio: 'ignore' });
      if (found.status === 0) {
        spawn(terminalBin, args, {
          cwd,
          stdio: 'ignore',
          detached: true
        }).unref();
        return true;
      }
    }

    throw new Error('No compatible terminal emulator found on this system');

  } catch (error) {
    throw new Error(`Failed to open new tab: ${error.message}`);
  }
}


async function getTestArgument() {
  const argument = await getMultiLineInput('\n📝 Enter your Playwright test code or description:');

  if (!argument.trim()) {
    console.clear();
    console.log('❌ No input provided. Please try again.');
    return getTestArgument();
  }

  return argument.trim();
}

async function getEnvironmentVariables(existingVars) {
  const baseVars = ['BASE_PAGE', 'BASE_API'];
  const questions = [];

  // First ask for BASE_PAGE and BASE_API
  for (const varName of baseVars) {
    const existing = existingVars[varName];
    const message = existing
      ? `${varName}(${existing}) (press Enter if current is OK):`
      : `${varName} (press Enter to skip if not needed):`;

    questions.push({
      type: 'input',
      name: varName,
      message,
      default: existing || ''
    });
  }

  const answers = await inquirer.prompt(questions);

  // Only ask for API_DOCUMENTATION if BASE_API was provided
  if (answers.BASE_API && answers.BASE_API.trim()) {
    const existing = existingVars.API_DOCUMENTATION;
    const message = existing
      ? `API_DOCUMENTATION(${existing}) (press Enter if current is OK):`
      : `API_DOCUMENTATION (required when BASE_API is provided):`;

    const apiDocAnswer = await inquirer.prompt([{
      type: 'input',
      name: 'API_DOCUMENTATION',
      message,
      default: existing || '',
      validate: (input) => {
        if (!input || !input.trim()) {
          return 'API_DOCUMENTATION is required when BASE_API is provided. Please enter a value.';
        }
        return true;
      }
    }]);

    answers.API_DOCUMENTATION = apiDocAnswer.API_DOCUMENTATION;
  } else {
    // If no BASE_API, keep existing API_DOCUMENTATION value or empty
    answers.API_DOCUMENTATION = existingVars.API_DOCUMENTATION || '';
  }

  return answers;
}

function writeEnvironmentFile(cwd, variables) {
  const playwrightDir = path.join(cwd, 'playwright-automation');
  const envPath = path.join(playwrightDir, '.env');
  const allVars = ['BASE_PAGE', 'BASE_API', 'API_DOCUMENTATION'];

  if (!fs.existsSync(playwrightDir)) {
    fs.mkdirSync(playwrightDir, { recursive: true });
  }

  let existingContent = '';
  let existingLines = [];

  if (fs.existsSync(envPath)) {
    existingContent = fs.readFileSync(envPath, 'utf8');
    existingLines = existingContent.split('\n');
  }

  const updatedLines = [];
  const processedVars = new Set();

  existingLines.forEach(line => {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match && allVars.includes(match[1])) {
      if (variables[match[1]] && variables[match[1]].trim()) {
        updatedLines.push(`${match[1]}=${variables[match[1]]}`);
      }
      processedVars.add(match[1]);
    } else if (line.trim()) {
      updatedLines.push(line);
    }
  });

  allVars.forEach(varName => {
    if (!processedVars.has(varName) && variables[varName] && variables[varName].trim()) {
      updatedLines.push(`${varName}=${variables[varName]}`);
    }
  });

  if (updatedLines.length > 0 && !updatedLines[updatedLines.length - 1].trim()) {
    updatedLines.pop();
  }
  updatedLines.push('');

  fs.writeFileSync(envPath, updatedLines.join('\n'));
}

function displayWelcome() {
  console.clear();
  console.log('╭─────────────────────────────────────────────╮');
  console.log('│                                             │');
  console.log('│         🎭 Playwright AI Automator          │');
  console.log('│                                             │');
  console.log('│     Navigate with ↑ ↓ arrows, Enter to      │');
  console.log('│     select, or use number keys              │');
  console.log('│                                             │');
  console.log('╰─────────────────────────────────────────────╯');
  console.log('');
}

async function showMainMenu() {
  const cwd = process.cwd();
  const packageManager = detectPackageManager(cwd);
  const envCheck = checkEnvironmentVariables(cwd);
  const baseUrl = envCheck.existingVars.BASE_PAGE || '';
  const command = getCodegenCommand(packageManager, baseUrl);

  const choices = [];

  if (envCheck.noEnvFile) {
    choices.push({
      name: '🔧 Add Environment Variables',
      value: 'add-env-vars',
      short: 'Add Environment Variables'
    });
  } else {
    choices.push({
      name: '🚀 Run Playwright Codegen',
      value: 'codegen-tab',
      short: 'Run Codegen'
    });
    choices.push({
      name: '🧪 Add Frontend Test',
      value: 'add-frontend-test',
      short: 'Add Frontend Test'
    });
    choices.push({
      name: '🔗 Add API Test',
      value: 'add-api-test',
      short: 'Add API Test'
    });

    if (envCheck.needsSetup) {
      choices.push({
        name: '🔧 Add Environment Variables',
        value: 'add-env-vars',
        short: 'Add Environment Variables'
      });
    } else {
      choices.push({
        name: '🔧 Update Environment Variables',
        value: 'add-env-vars',
        short: 'Update Environment Variables'
      });
    }
  }

  choices.push({
    name: '❌ Exit',
    value: 'exit',
    short: 'Exit'
  });

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices,
      pageSize: 10
    }
  ]);

  return { action, command, cwd, envCheck };
}

async function main() {
  try {
    displayWelcome();

    while (true) {
      const { action, command, cwd, envCheck } = await showMainMenu();

      switch (action) {
        case 'exit':
          console.log('\n👋 Thanks for using Playwright AI Automator!');
          process.exit(0);
          break;

        case 'codegen-tab':
          try {
            openInNewTab(command, cwd);
            console.clear();
            console.log('✅ Launched Playwright codegen in a new tab!');
          } catch (error) {
            console.clear();
            console.log(`⚠️  ${error.message}`);
            console.log(`Manual command: ${command}`);
          }
          break;

        case 'add-frontend-test':
          const argument = await getTestArgument();
          const claudeCommand = getClaudeCommand(argument);
          try {
            openInNewTab(claudeCommand, cwd);
            console.clear();
            console.log('✅ Launched Claude Add-Frontend-Test in a new tab!');
          } catch (error) {
            console.clear();
            console.log(`⚠️  ${error.message}`);
            console.log(`Manual command: ${claudeCommand}`);
          }
          break;

        case 'add-api-test':
          const apiArgument = await getTestArgument();
          const apiClaudeCommand = getApiClaudeCommand(apiArgument);
          try {
            openInNewTab(apiClaudeCommand, cwd);
            console.clear();
            console.log('✅ Launched Claude Add-Api-Test in a new tab!');
          } catch (error) {
            console.clear();
            console.log(`⚠️  ${error.message}`);
            console.log(`Manual command: ${apiClaudeCommand}`);
          }
          break;

        case 'add-env-vars':
          try {
            const variables = await getEnvironmentVariables(envCheck.existingVars);
            writeEnvironmentFile(cwd, variables);

            const setVariables = Object.entries(variables).filter(([key, value]) => value && value.trim());

            if (setVariables.length > 0) {
              // Check if we have at least one variable set and auto-run Prepare-new-environment
              if (setVariables.length >= 1) {
                const prepareCommand = getPrepareEnvironmentCommand();
                try {
                  openInNewTab(prepareCommand, cwd);
                  console.clear();
                  console.log('✅ Environment variables saved and launched environment setup!');
                } catch (error) {
                  console.clear();
                  console.log('✅ Environment variables saved!');
                  console.log(`⚠️  Setup failed: ${error.message}`);
                  console.log(`Manual command: ${prepareCommand}`);
                }
              } else {
                console.clear();
                console.log('✅ Environment variables saved!');
              }
            } else {
              console.clear();
              console.log('ℹ️ No variables were set (all were skipped).');
            }
          } catch (error) {
            console.clear();
            console.log(`⚠️  Failed to save environment variables: ${error.message}`);
          }
          break;

        default:
          console.clear();
          console.log('❌ Invalid selection. Please try again.');
      }
    }

  } catch (error) {
    if (error.isTtyError) {
      console.error('❌ This tool requires an interactive terminal environment.');
    } else if (error.name === 'ExitPromptError') {
      console.log('\n👋 Goodbye!');
      process.exit(0);
    } else {
      console.error('❌ An unexpected error occurred:', error.message);
      process.exit(1);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Interrupted. Goodbye!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Terminated. Goodbye!');
  process.exit(0);
});

main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});