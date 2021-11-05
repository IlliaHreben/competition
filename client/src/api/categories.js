import Base from './base.js';

class Categories extends Base {
    // create = (payload) => {
    //     const { type, ...rest } = payload;

    //     return this.apiClient.post(`user/orders/${type}`, rest);
    // }

    list = async (params) => {
        return this.apiClient.get('categories', params);
    }

    show = async (id, params) => {
        return this.apiClient.get(`categories/${id}`, params);
    }

    calculateFights = async (params) => {
        return this.apiClient.get('categories/calculate-fights', params);
    }

    bulkDelete = async (params) => {
        return this.apiClient.delete('categories/bulk', params);
    }
}

export default Categories;
