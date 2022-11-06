import ServiceBase from '../Base.js';
import { dumpState } from '../../utils';

import State from '../../models/State.js';

export default class StatesList extends ServiceBase {
  static validationRules = {
    search: ['string', { max_length: 300 }],
    limit: [{ min_length: 1 }, { max_length: 1000 }, { default: 10 }],
  };

  async execute({ limit, ...rest }) {
    const scopes = Object.entries(rest).map((filter) => ({ method: filter }));

    const rows = await State.scope(...scopes).findAll({
      limit,
      order: [['name', 'ASC']],
    });

    return {
      data: rows.map(dumpState),
    };
  }
}
