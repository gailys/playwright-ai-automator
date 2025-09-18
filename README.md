# 🎭 Playwright AI Automator

A terminal-based navigation tool for Playwright automation, similar to WebdriverIO's installation interface. Navigate with arrow keys and run Playwright codegen with ease!

## ✨ Features

- **Arrow Key Navigation**: Navigate through options using ↑ ↓ arrow keys
- **Cross-Platform**: Works on macOS, Linux, and Windows
- **Smart Package Manager Detection**: Automatically detects and uses pnpm, yarn, or npm
- **New Terminal Tab Support**: Launch Playwright codegen in a new terminal tab/window
- **Fallback Support**: Falls back to current terminal if new tab opening fails

## 🚀 Installation

### Option 1: Run directly with npx (recommended)
```bash
npx playwright-ai-automator
```

### Option 2: Install globally
```bash
npm install -g playwright-ai-automator
playwright-ai-automator
```

### Option 3: Clone and run locally
```bash
git clone <repository>
cd playwright-ai-automator
npm install
npm run build
npm start
```

## 🎯 Usage

1. Run `npx playwright-ai-automator` in your terminal
2. Use arrow keys (↑ ↓) to navigate through options
3. Press Enter to select an option
4. Choose from:
   - **Run Playwright Codegen (new terminal tab)**: Opens codegen in a new terminal
   - **Run Playwright Codegen (current terminal)**: Runs codegen in the current terminal
   - **Exit**: Closes the tool

## 🛠️ How It Works

The tool automatically:
- Detects your current working directory
- Identifies your package manager (pnpm, yarn, or npm)
- Constructs the appropriate command (`pnpm dlx playwright codegen`, `yarn dlx playwright codegen`, or `npx playwright codegen`)
- Opens a new terminal tab/window based on your operating system:
  - **macOS**: Uses Terminal.app or iTerm2
  - **Windows**: Tries Windows Terminal first, falls back to CMD
  - **Linux**: Tries various terminal emulators (gnome-terminal, konsole, xfce4-terminal, etc.)

## 🎨 Interface Preview

```
╭─────────────────────────────────────────────╮
│                                             │
│         🎭 Playwright AI Automator         │
│                                             │
│     Navigate with ↑ ↓ arrows, Enter to     │
│     select, or use number keys              │
│                                             │
╰─────────────────────────────────────────────╯

📁 Working directory: /path/to/your/project
📦 Package manager detected: npm
🔧 Will run: npx playwright codegen

? What would you like to do? (Use arrow keys)
❯ 🆕 Run Playwright Codegen (new terminal tab)
  📍 Run Playwright Codegen (current terminal)
  ❌ Exit
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build

# Test the built version
npm start
```

## 📦 Distribution

To publish to npm:

```bash
npm publish
```

Users can then run it with:
```bash
npx playwright-ai-automator
```

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📄 License

MIT License