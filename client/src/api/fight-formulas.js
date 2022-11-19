import Base from './base.js';

class FightFormulas extends Base {
  create = (payload) => {
    return this.apiClient.post('fight-formulas', payload);
  };

  update = (id, payload) => {
    return this.apiClient.patch(`fight-formulas/${id}`, { data: payload });
  };

  list = async (params) => {
    return this.apiClient.get('fight-formulas', params);
  };

  show = async (id, params) => {
    return this.apiClient.get(`fight-formulas/${id}`, params);
  };

  delete = async (id) => {
    return this.apiClient.delete('fight-formulas', { id });
  };
}

export default FightFormulas;
