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
}

export default Cards;
