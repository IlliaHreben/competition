import ServiceBase   from '../Base.js';
import { dumpCoach } from '../../utils';

import Coach         from '../../models/Coach.js';

export default class CoachesList extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      clubId        : [ 'not_empty', 'uuid' ]
    };

    async execute ({ ...rest }) {
      const filters = Object.entries(rest).map(filter => ({ method: filter }));

      const { rows, count } = await Coach
        .scope(...filters)
        .findAndCountAll();

      return {
        data : rows.map(dumpCoach),
        meta : {
          filteredCount: count
        }
      };
    }
}
