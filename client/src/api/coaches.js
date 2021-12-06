import Base from './base.js';

class Coaches extends Base {
    list = async (params) => {
        return this.apiClient.get('coaches', params);
    }

    show = async (id, params) => {
        return this.apiClient.get(`coaches/${id}`, params);
    }

    delete = async (id) => {
        return this.apiClient.delete('coaches/', { id });
    }

    create = (payload) => {
        return this.apiClient.post('coaches', payload);
    }
}

export default Coaches;
