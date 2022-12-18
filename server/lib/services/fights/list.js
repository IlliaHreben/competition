import ServiceBase from '../Base.js';
import { dumpFight } from '../../utils';

import Fight from '../../models/Fight.js';

export default class FightsList extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],
    limit: 'limit',
    offset: 'offset',

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

    include: [
      'to_array',
      {
        list_of: {
          one_of: [
            'categoryWithSection',
            'cardsWithFighter',
            'cardsWithFighterAndLinked',
            'fightFormula',
            'fightSpace',
          ],
        },
      },
      { default: [[]] },
    ],
  };

  async execute({ include, limit, offset, ...rest }) {
    const filters = Object.entries(rest).map((filter) => ({ method: filter }));
    console.log('='.repeat(50)); // !nocommit
    console.log(filters);
    console.log('='.repeat(50));

    const { rows, count } = await Fight.scope(...include, ...filters).findAndCountAll({
      order: [
        ['serialNumber', 'ASC'],
        ['fightSpaceId', 'ASC'],
        ['id', 'ASC'],
      ],
      limit,
      offset,
    });

    return {
      data: rows.map(dumpFight),
      meta: {
        filteredCount: count,
        limit,
        offset,
      },
    };
  }
}
