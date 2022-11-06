import Base from './base.js';

class Fighters extends Base {
    list = async (params) => {
        return this.apiClient.get('fighters', params);
    };

    show = async (id, params) => {
        return this.apiClient.get(`fighters/${id}`, params);
    };

    delete = async (id) => {
        return this.apiClient.delete('fighters/', { id });
    };

    update = (id, recalculate, competitionId, payload) => {
        return this.apiClient.patch(`fighters/${id}`, { recalculate, competitionId, data: payload });
    };

    create = (payload) => {
        return this.apiClient.post('fighters/', payload);
    };
}

export default Fighters;
