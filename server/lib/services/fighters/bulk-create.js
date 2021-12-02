import ServiceBase     from '../Base.js';
import { dumpFighter } from '../../utils';

import Fighter         from '../../models/Fighter.js';
import Category        from '../../models/Category.js';

export default class FightersBulkCreate extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      data          : [ 'required', {
        list_of_objects: [ {
          fighterId       : [ 'required', 'uuid' ],
          clubId          : [ 'required', 'uuid' ],
          secondaryClubId : [ 'uuid' ],
          coachId         : [ 'required', 'uuid' ],
          sectionId       : [ 'required', 'uuid' ],
          weight          : [ 'required', { number_between: [ 0, 999 ] } ],
          realWeight      : [ { number_between: [ 0, 999 ] } ],
          group           : [ { one_of: [ 'A', 'B' ] } ],
          city            : [ 'required', 'string' ],
          birthDate       : [ 'required', 'iso_date' ]
        } ]
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
