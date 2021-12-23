import ServiceBase      from '../Base.js';
import { dumpCategory } from '../../utils';

import Category         from '../../models/Category.js';

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
          col   : 'Category.id',
          where : {
            competitionId
          },
          limit,
          offset,
          benchmark : true,
          logging   : console.log
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
