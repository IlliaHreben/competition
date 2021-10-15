import errorsHandler          from './error-handler';
import ApiClient              from './ApiClient.js';
import Categories             from './categories';

export default function f ({ apiUrl, apiPrefix, apiNews } = {}) {
    const apiClient = new ApiClient({
        apiUrl,
        errorsHandler,
        prefix: apiPrefix
    });

    const params = { apiClient };

    return {
        apiClient,
        categories: new Categories(params)
    };
}
