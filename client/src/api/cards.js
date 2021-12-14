import Base from './base.js';

class Cards extends Base {
    list = async (params) => {
        return this.apiClient.get('cards', params);
    }

    show = async (id, params) => {
        return this.apiClient.get(`cards/${id}`, params);
    }

    delete = async (id) => {
        return this.apiClient.delete('cards/', { id });
    }

    create = (payload) => {
        return this.apiClient.post('cards', payload);
    }

    update = (id, payload) => {
        return this.apiClient.patch(`cards/${id}`, { data: payload });
    }
}

export default Cards;
