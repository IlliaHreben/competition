import ServiceBase       from '../Base.js';
// import { dumpCategory }  from '../../utils';

import Category          from '../../models/Category.js';
import { sections }      from '../../constants/categories.js';

export default class BulkCategoriesDelete extends ServiceBase {
    static validationRules = {
      data: [ 'required', {
        nested_object: {
          competitionId : [ { required_if_not_present: 'id' }, 'uuid' ],
          id            : [ { required_if_not_present: 'section' }, 'to_array', { list_of: 'uuid' } ],
          // type       : [ 'not_empty', { list_of: { one_of: [ 'ring', 'tatami' ] } } ],
          // weightFrom : [ 'positive_integer' ],
          // weightTo   : [ 'positive_integer' ],
          // sex        : [ { list_of: { one_of: [ 'man', 'woman' ] } } ],
          // ageFrom    : [ 'positive_integer' ],
          // ageTo      : [ 'positive_integer' ],
          section       : [ { list_of: { one_of: sections } } ]
        }
      } ]
    };

    async execute ({ data }) {
      const categories = await Category.findAll({ where: data, attributes: [ 'id' ] });

      await Category.destroy({
        where: data
      });

      return {
        data: categories.map(({ id }) => id)
      };
    }
}
