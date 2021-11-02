import ServiceBase       from '../Base.js';
import { dumpCategory }  from '../../utils';

import Category          from '../../models/Category.js';
import { sections }      from '../../constants/categories.js';

export default class BulkCategoriesDelete extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      by            : [ 'required', {
        nested_object: {
          ids     : [ 'to_array', { list_of: 'uuid' } ],
          // type       : [ 'not_empty', { list_of: { one_of: [ 'ring', 'tatami' ] } } ],
          // weightFrom : [ 'positive_integer' ],
          // weightTo   : [ 'positive_integer' ],
          // sex        : [ { list_of: { one_of: [ 'man', 'woman' ] } } ],
          // ageFrom    : [ 'positive_integer' ],
          // ageTo      : [ 'positive_integer' ],
          section : [ { list_of: { one_of: sections } } ]
        }
      } ]
    };

    async execute ({ competitionId, by }) {
      if (by.id) delete by.section;

      const categories = await Category
        .destroy({
          where: by
        });

      return {
        data: categories.map(dumpCategory)
      };
    }
}
