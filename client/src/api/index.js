import errorsHandler          from './error-handler';
import ApiClient              from './ApiClient.js';
import Categories             from './categories';
import Competitions           from './competitions';
import FightSpaces            from './fight-spaces';
import Sections               from './sections';

export default function apiAggregator ({ apiUrl, apiPrefix } = {}) {
    const apiClient = new ApiClient({
        apiUrl,
        errorsHandler,
        prefix: apiPrefix
    });

    const params = { apiClient };

    return {
        apiClient,
        categories   : new Categories(params),
        competitions : new Competitions(params),
        fightSpaces  : new FightSpaces(params),
        sections     : new Sections(params)
    };
}
