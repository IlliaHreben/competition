import ServiceBase       from '../Base.js';
import { dumpCategory }  from '../../utils';

import Category          from '../../models/Category.js';
import Card              from '../../models/Card.js';
import Fight             from '../../models/Fight.js';

export default class CategoriesList extends ServiceBase {
    static validationRules = {
      id: [ 'required', 'uuid' ]
    };

    async execute ({ id }) {
      const category = await Category.findById(id, {
        include: [ 'Cards', {
          model   : Fight,
          as      : 'Fights',
          include : [
            { model: Card, as: 'FirstCard', include: [ 'Fighter', 'Club', 'Coach' ] },
            { model: Card, as: 'SecondCard', include: [ 'Fighter', 'Club', 'Coach' ] }
          ],
          order: [ [ 'orderNumber', 'DESC' ] ]
        } ]
      });

      return {
        data: dumpCategory(category)
      };
    }
}
