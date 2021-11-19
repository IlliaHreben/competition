import Base from './base.js';

class Categories extends Base {
    list = async (params) => {
        return this.apiClient.get('sections', params);
    }

    show = async (id, params) => {
        return this.apiClient.get(`sections/${id}`, params);
    }

    delete = async (id) => {
        return this.apiClient.delete('sections/', { id });
    }
}

export default Categories;
