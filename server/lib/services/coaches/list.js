import ServiceBase from '../Base.js';
import { dumpCoach } from '../../utils';

import Coach from '../../models/Coach.js';

export default class CoachesList extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],
    clubId: ['not_empty', 'uuid'],
    include: ['to_array', { list_of: { one_of: ['clubs'] } }, { default: [[]] }],
  };

  async execute({ include, ...rest }) {
    const filters = Object.entries(rest).map((filter) => ({ method: filter }));

    const { rows, count } = await Coach.scope(...filters, ...include).findAndCountAll({
      order: [['lastName', 'ASC']],
    });

    return {
      data: rows.map(dumpCoach),
      meta: {
        filteredCount: count,
      },
    };
  }
}
