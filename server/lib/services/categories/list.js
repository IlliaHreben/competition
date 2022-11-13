import ServiceBase from '../Base.js';
import { dumpCategory } from '../../utils';

import Category from '../../models/Category.js';
import Card from '../../models/Card.js';

export default class CategoriesList extends ServiceBase {
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
      ...(filters.length ? { subQuery: false } : { limit, offset }),
      // benchmark: true,
      // logging: console.log,
      // order: [ [ sort, order ] ]
    };
    const scope = [...include];

    if (filters.length) {
      const { rows: cards, count: cardsCount } = await Card.scope(...filters, {
        method: ['competitionRelated', competitionId],
      }).findAndCountAll({
        col: 'Card.categoryId',
        limit,
        offset,
        order: [
          [Card.associations.Fighter, 'lastName', 'ASC'],
          [Card.associations.Fighter, 'name', 'ASC'],
        ],
        distinct: true,
        logging: console.log,
      });

      count = cardsCount;

      query.where.push({ '$Cards.id$': cards.map((c) => c.id) });
    } else {
      count = await Card.scope(...filters, {
        method: ['competitionRelated', competitionId],
      }).count({
        col: 'Card.categoryId',
        distinct: true,
        logging: console.log,
      });
    }

    const rows = await Category.scope(scope).findAll(query);

    return {
      data: rows.map(dumpCategory),
      meta: {
        filteredCount: count,
        limit,
        offset,
      },
    };
  }
}
