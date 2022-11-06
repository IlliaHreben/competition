import Base from './base.js';

class States extends Base {
    list = async (params) => {
        return this.apiClient.get('states', params);
    };

    show = async (id, params) => {
        return this.apiClient.get(`states/${id}`, params);
    };

    delete = async (id) => {
        return this.apiClient.delete('states/', { id });
    };

    create = (payload) => {
        return this.apiClient.post('states/', payload);
    };
}

export default States;
