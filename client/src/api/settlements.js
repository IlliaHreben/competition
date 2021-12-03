import Base from './base.js';

class Settlements extends Base {
    list = async (params) => {
        return this.apiClient.get('settlements', params);
    }

    show = async (id, params) => {
        return this.apiClient.get(`settlements/${id}`, params);
    }

    delete = async (id) => {
        return this.apiClient.delete('settlements/', { id });
    }
}

export default Settlements;
