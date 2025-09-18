import { EndpointType, getHeader } from '../../utils/axios-utils/axios-wrapper';
import environment from '../../environment';

export abstract class BaseAPI {
    protected baseURL: string;
    protected endpoint: string;

    constructor(baseURL?: string, endpoint: string = '') {
        this.baseURL = baseURL ?? environment.apiUrl;
        this.endpoint = endpoint;

        if (!this.baseURL) {
            throw new Error('API base URL not configured. Check environment.apiUrl setting.');
        }
    }

    protected getFullUrl(path: string = ''): string {
        try {
            return new URL(path || this.endpoint, this.baseURL).toString();
        } catch (error) {
            throw new Error(`Invalid URL construction: base="${this.baseURL}", path="${path || this.endpoint}". ${error}`);
        }
    }

    protected getHeaders(endpointType: EndpointType): any {
        return getHeader(endpointType);
    }
}