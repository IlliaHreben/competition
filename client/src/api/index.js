import errorsHandler from './error-handler';
import ApiClient from './ApiClient.js';
import Categories from './categories';
import Competitions from './competitions';
import FightSpaces from './fight-spaces';
import Sections from './sections';
import Cards from './cards';
import Clubs from './clubs';
import Coaches from './coaches';
import Settlements from './settlements';

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
        sections     : new Sections(params),
        cards        : new Cards(params),
        clubs        : new Clubs(params),
        coaches      : new Coaches(params),
        settlements  : new Settlements(params)
    };
}
