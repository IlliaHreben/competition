import ServiceBase from '../Base.js';
import { dumpFight } from '../../utils';

import Fight from '../../models/Fight.js';

export default class FightsList extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],
    // search: ['string'],
    // limit: ['positive_integer', { number_between: [0, 1000] }, { default: 10 }],
    // offset: ['integer', { min_number: 0 }, { default: 0 }],
    // coachId: ['not_empty', 'uuid'],
    // clubId: ['not_empty', 'uuid'],
    // settlementId: ['not_empty', 'uuid'],
    // sex: ['string', { min_length: 1 }, { max_length: 100 }],
    // group: [{ one_of: ['A', 'B', null] }],
    include: [
      'to_array',
      {
        list_of: {
          one_of: ['categoryWithSection', 'cardsWithFighter', 'fightFormula', 'fightSpace'],
        },
      },
      { default: [[]] },
    ],
  };

  async execute({ include }) {
    // const filters = Object.entries(rest).map((filter) => ({ method: filter }));

    const fights = await Fight.scope(...include).findAll({
      order: [
        ['serialNumber', 'ASC'],
        ['fightSpaceId', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    return {
      data: fights.map(dumpFight),
      // meta: {
      //   filteredCount: count,
      //   // limit,
      //   // offset,
      // },
    };
  }
}
