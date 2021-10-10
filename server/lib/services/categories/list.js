import { Op }           from '../../sequelize.js';
import ServiceBase      from '../Base.js';
import { dumpCategory } from '../../utils';

import Category         from '../../models/Category.js';

export default class CountriesList extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      limit         : [ 'positive_integer', { default: 10 } ],
      offset        : [ 'integer', { min_number: 0 }, { default: 0 } ]
    };

    async execute ({ competitionId }) {
      const categories = await Category.findAll({
        where: {
          competitionId,
          '$Cards.id$': { [Op.not]: null }
        },
        include: [ 'Cards' ]
        // limit,
        // offset,
        // order: [ [ sort, order ] ]
      });

      return {
        data: categories.map(dumpCategory)
        // meta : {
        //   totalCount,
        //   filteredCount,
        //   limit,
        //   offset
        // }
      };
    }
}
