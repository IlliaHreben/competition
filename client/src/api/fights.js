import Base from './base.js';

class Fights extends Base {
  list = async (params) => {
    return this.apiClient.get('fights', params);
  };

  show = async (id, params) => {
    return this.apiClient.get(`fights/${id}`, params);
  };

  delete = async (id) => {
    return this.apiClient.delete('fights/', { id });
  };

  create = (payload) => {
    return this.apiClient.post('fights', payload);
  };

  update = (id, payload) => {
    return this.apiClient.patch(`fights/${id}`, { data: payload });
  };

  setWinner = ({ id, winnerId }) => {
    return this.apiClient.put(`fights/${id}/winner`, { winnerId });
  };
}

export default Fights;
