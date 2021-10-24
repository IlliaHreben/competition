import ServiceBase          from '../Base.js';
import { dumpCompetition }  from '../../utils';

import Competition          from '../../models/Competition.js';

export default class CompetitionsList extends ServiceBase {
    static validationRules = {
      limit  : [ 'positive_integer', { default: 10 } ],
      offset : [ 'integer', { min_number: 0 }, { default: 0 } ]
    };

    async execute () {
      const competitions = await Competition.findAll({
        // limit,
        // offset,
        // order: [ [ sort, order ] ]
      });

      return {
        data: competitions.map(dumpCompetition)
        // meta : {
        //   totalCount,
        //   filteredCount,
        //   limit,
        //   offset
        // }
      };
    }
}
