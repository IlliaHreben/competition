import ServiceBase  from '../Base.js';

import Category     from '../../models/Category.js';
import Card         from '../../models/Card.js';
import ServiceError from '../service-error';

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
          sectionId     : [ { list_of: 'uuid' } ]
        }
      } ]
    };

    async execute ({ data }) {
      const categories = await Category.findAll({ where: data, attributes: [ 'id' ] });

      const cards = await Card.findAll({ where: { categoryId: data }, include: [ 'Fighter' ] });
      if (cards.length) throw new ServiceError('RELATED_INSTANCES', { cards: cards.map(c => `${c.Fighter.lastName} ${c.Fighter.name}`) });

      await Category.destroy({
        where: data
      });

      return {
        data: categories.map(({ id }) => id)
      };
    }
}
