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
}

export default Coaches;
