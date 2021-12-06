import Base from './base.js';

class Clubs extends Base {
    list = async (params) => {
        return this.apiClient.get('clubs', params);
    }

    show = async (id, params) => {
        return this.apiClient.get(`clubs/${id}`, params);
    }

    delete = async (id) => {
        return this.apiClient.delete('clubs/', { id });
    }

    create = (payload) => {
        return this.apiClient.post('clubs', payload);
    }
}

export default Clubs;
