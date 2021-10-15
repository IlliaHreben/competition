import { Op }            from '../../sequelize.js';
import ServiceBase       from '../Base.js';
import { dumpCategory }  from '../../utils';

import Category          from '../../models/Category.js';
import Card              from '../../models/Card.js';
import Fight             from '../../models/Fight.js';

export default class CategoriesList extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      limit         : [ 'positive_integer', { default: 10 } ],
      offset        : [ 'integer', { min_number: 0 }, { default: 0 } ]
    };

    async execute ({ competitionId }) {
      const categories = await Category.findAll({
        where: {
          competitionId,
          '$Fights.id$': { [Op.not]: null }
        },
        include: [ {
          model   : Fight,
          as      : 'Fights',
          include : [
            { model: Card, as: 'FirstCard', include: [ 'Fighter', 'Club', 'Coach' ] },
            { model: Card, as: 'SecondCard', include: [ 'Fighter', 'Club', 'Coach' ] }
          ]
        } ]
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
