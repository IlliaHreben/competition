import ServiceBase     from '../Base.js';
import { dumpFighter } from '../../utils';

import Fighter         from '../../models/Fighter.js';
import Category        from '../../models/Category.js';

export default class FightersBulkCreate extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      data          : [ 'required', {
        nested_object: {
          name      : [ 'required', 'string', { min_length: 1 }, { max_length: 1000 } ],
          lastName  : [ 'required', 'string', { min_length: 1 }, { max_length: 1000 } ],
          sex       : [ 'required', { one_of: [ 'man', 'woman' ] } ],
          clubId    : [ 'required', 'uuid' ],
          coachId   : [ 'required', 'uuid' ],
          birthDate : [ 'required', 'iso_date' ]
        }
      } ]
    };

    async execute ({ competitionId, data }) {
      const fightersWithCompetition = data.map(c => ({ competitionId, ...c }));
      const fighters = await Fighter.bulkCreate(fightersWithCompetition);

      const categoryIds = [ ...new Set(fighters.map(c => c.categoryId)) ];
      const categories = await Category.findAll({ where: { id: categoryIds } });
      await Promise.all(categories.map(category => category.calculateFights()));

      return {
        data: fighters.map(dumpFighter)
        // meta : {
        //   totalCount,
        //   filteredCount,
        //   limit,
        //   offset
        // }
      };
    }
}
