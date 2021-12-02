// import { Op }            from '../../sequelize.js';
import ServiceBase      from '../Base.js';
import { dumpCategory } from '../../utils';

import Category         from '../../models/Category.js';
// import Fight             from '../../models/Fight.js';

export default class CategoriesList extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      limit         : [ 'positive_integer', { default: 10 } ],
      offset        : [ 'integer', { min_number: 0 }, { default: 0 } ],
      include       : [ 'to_array', { list_of: { one_of: [ 'cards', 'sections' ] } } ]
    };

    async execute ({ competitionId, limit, offset, include = [] }) {
      const { rows, count } = await Category
        .scope(...include)
        .findAndCountAll({
          where: {
            competitionId
          },
          limit,
          offset
        // order: [ [ sort, order ] ]
        });

      return {
        data : rows.map(dumpCategory),
        meta : {
          filteredCount: count,
          limit,
          offset
        }
      };
    }
}
