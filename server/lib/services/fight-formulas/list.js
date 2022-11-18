import ServiceBase from '../Base.js';
import { dumpFightFormula } from '../../utils';

import FightFormula from '../../models/FightFormula.js';
import Card from '../../models/Card.js';
import { Sequelize } from 'sequelize';

export default class FightFormulasList extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],

    search: ['string'],
    coachId: ['not_empty', 'uuid'],
    clubId: ['not_empty', 'uuid'],
    sectionId: ['not_empty', 'uuid'],
    settlementId: ['not_empty', 'uuid'],
    sex: ['string', { min_length: 1 }, { max_length: 100 }],
    group: [{ one_of: ['A', 'B', null] }],

    limit: ['positive_integer', { default: 10 }],
    offset: ['integer', { min_number: 0 }, { default: 0 }],
    include: ['to_array', { list_of: { one_of: ['cards', 'sections'] } }],
  };

  async execute({ competitionId, limit, offset, include = [], ...rest }) {
    const filters = Object.entries(rest).map((filter) => ({ method: filter }));

    let count = null;

    const query = {
      where: [{ competitionId }],
      // ...(filters.length ? {} : { limit, offset }),
      limit,
      offset,
      // benchmark: true,
      // logging: console.log,
      // order: [ [ sort, order ] ]
    };

    const cardScope = [...filters, { method: ['competitionRelated', competitionId] }];

    if (filters.length) {
      const cards = await Card.scope(cardScope).findAll({
        attributes: [
          Sequelize.literal('DISTINCT ON("fightFormulaId") 1'),
          // [
          //   Sequelize.literal(
          //     '(SELECT COUNT(*) FROM "Cards" WHERE "Cards"."fightFormulaId" = "Card"."id")'
          //   ),
          //   'cardsCount',
          // ],
          'id',
          'fightFormulaId',
        ],
        // col: 'Card.fightFormulaId',
        // limit,
        // offset,
        order: [
          ['fightFormulaId', 'ASC'],
          // [Sequelize.literal('"cardsCount"'), 'DESC'],
          // [Card.associations.Fighter, 'lastName', 'ASC'],
          // [Card.associations.Fighter, 'name', 'ASC'],
        ],
        // distinct: true,
        // logging: console.log,
      });

      count = cards.length;

      query.where.push({ id: cards.map((c) => c.fightFormulaId) });
    } else {
      count = await Card.scope(cardScope).count({
        col: 'Card.fightFormulaId',
        distinct: true,
      });
    }

    const rows = await FightFormula.scope(...include).findAll(query);

    return {
      data: rows.map(dumpFightFormula),
      meta: {
        filteredCount: count,
        limit,
        offset,
      },
    };
  }
}
