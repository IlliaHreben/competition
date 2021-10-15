import Base from './Base.js';

class Categories extends Base {
    // create = (payload) => {
    //     const { type, ...rest } = payload;

    //     return this.apiClient.post(`user/orders/${type}`, rest);
    // }

    getList = async (params) => {
        return this.apiClient.get('categories', params);
    }

    show = async (id, params) => {
        return this.apiClient.get(`categories/${id}`, params);
    }

    calculateFights = async (params) => {
        return this.apiClient.get('categories/calculate-fights', params);
    }
}

export default Categories;
