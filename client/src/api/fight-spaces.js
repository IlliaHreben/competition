import Base from './base.js';

class Competitions extends Base {
    bulkUpdate = (competitionId, payload) => {
        return this.apiClient.patch('fight-spaces/bulk', { competitionId, data: payload });
    }

    update = (id, payload) => {
        return this.apiClient.patch(`fight-spaces/${id}`, { data: payload });
    }

    list = async (params) => {
        return this.apiClient.get('fight-spaces', params);
    }

    show = async (id, params) => {
        return this.apiClient.get(`fight-spaces/${id}`, params);
    }
}

export default Competitions;
