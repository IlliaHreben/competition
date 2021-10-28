import { Op }                         from '../../sequelize-singleton.js';
import ServiceBase                    from '../Base.js';
import { dumpCompetition }            from '../../utils';

import Competition                    from '../../models/Competition.js';
import Card                           from '../../models/Card.js';
import Fighter                        from '../../models/Fighter.js';

export default class CompetitionsList extends ServiceBase {
    static validationRules = {
      limit  : [ 'positive_integer', { default: 10 } ],
      offset : [ 'integer', { min_number: 0 }, { default: 0 } ],
      sort   : [ { one_of: [ 'name', 'description', 'startDate', 'endDate' ] }, { default: 'startDate' } ],
      order  : [ { one_of: [ 'asc', 'desc' ] }, { default: 'asc' } ],
      search : [ 'string', { max_length: 1000 } ]
    };

    async execute ({ limit, offset, sort, order, search }) {
      const where = {
        ...search && { name: { [Op.startsWith]: search } }
      };

      const competitions = await Competition.findAll({
        where,
        limit,
        offset,
        order: [ [ sort, order ], [ 'id', 'desc' ] ]
      });

      const data = await Promise.all(competitions.map(async competition => {
        const cardsCount = await Card.count({ where: { competitionId: competition.id } });
        const fightersCount = await Fighter.count({
          where    : { '$Cards.competitionId$': competition.id },
          distinct : true,
          include  : 'Cards'
        });
        return { data: competition, meta: { cardsCount, fightersCount } };
      }));

      const [ totalCount, filteredCount ] = await Promise.all([
        Competition.count(),
        Competition.count({ where }) // todo
      ]);

      return {
        data : data.map(dumpCompetition),
        meta : {
          totalCount,
          filteredCount,
          limit,
          offset
        }
      };
    }
}
