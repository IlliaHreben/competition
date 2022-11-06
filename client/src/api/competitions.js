import Base from './base.js';

class Competitions extends Base {
    create = (payload) => {
        return this.apiClient.post('competitions', payload);
    };

    update = (id, payload) => {
        return this.apiClient.patch(`competitions/${id}`, { data: payload });
    };

    list = async (params) => {
        return this.apiClient.get('competitions', params);
    };

    show = async (id, params) => {
        return this.apiClient.get(`competitions/${id}`, params);
    };

    delete = async (id) => {
        return this.apiClient.delete('competitions', { id });
    };
}

export default Competitions;
