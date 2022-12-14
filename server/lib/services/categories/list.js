import ServiceBase from '../Base.js';
import { dumpCategory } from '../../utils';

import Category from '../../models/Category.js';
import { findAndReplace } from '../../utils/common.js';

export default class CategoriesList extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],

    search: ['string'],
    coachId: ['not_empty', 'uuid'],
    clubId: ['not_empty', 'uuid'],
    sectionId: ['not_empty', 'uuid'],
    settlementId: ['not_empty', 'uuid'],
    fightSpaceId: ['not_empty', 'uuid'],
    sex: ['string', { min_length: 1 }, { max_length: 100 }],
    group: [{ one_of: ['A', 'B', null] }],
    fightsCount: [
      'not_empty',
      'to_array',
      { list_of: ['integer', { min_length: 0 }, { max_length: Number.MAX_SAFE_INTEGER }] },
    ],

    display: ['not_empty', { one_of: ['all', 'filled'] }],

    limit: ['positive_integer', { default: 10 }],
    offset: ['integer', { min_number: 0 }, { default: 0 }],
    include: ['to_array', { list_of: { one_of: ['cards', 'sections'] } }],
  };

  async execute({ competitionId, limit, offset, display, include = [], ...rest }) {
    const filters = Object.entries(rest).map((filter) => ({ method: filter }));

    findAndReplace((scope) => scope === 'cards', include, {
      method: ['cards', display === 'all'],
    });

    const query = {
      replacements: rest,
      limit,
      offset,
      col: 'Category.id',
      logging: true,
    };

    // await Card.findAll({
    //   where: {
    //     '$"Card"."Fighter"."Club"."settlementId"$': '45d47018-351a-49d2-a450-5cd20268826a',
    //   },
    //   include: {
    //     model: Fighter,
    //     as: 'Fighter',
    //     include: {
    //       model: Club,
    //       as: 'Club',
    //       // where: { settlementId },
    //     },
    //   },
    //   logging: true,
    // });
    // return;

    const cardScope = [...filters, { method: ['competitionRelated', competitionId] }];

    const { rows, count } = await Category.scope([...include, ...cardScope]).findAndCountAll(query);
    // const count = await Category.scope(...include, ...cardScope).count(query);

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
