import errorsHandler          from './error-handler';
import ApiClient              from './ApiClient.js';
import Categories             from './categories';
import Competitions           from './competitions';

export default function f ({ apiUrl, apiPrefix } = {}) {
    const apiClient = new ApiClient({
        apiUrl,
        errorsHandler,
        prefix: apiPrefix
    });

    const params = { apiClient };

    return {
        apiClient,
        categories   : new Categories(params),
        competitions : new Competitions(params)
    };
}
