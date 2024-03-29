import ServiceBase from '../Base.js';
import { dumpFighter } from '../../utils';

import Fighter from '../../models/Fighter.js';

export default class FightersList extends ServiceBase {
  static validationRules = {
    search: ['string'],
    limit: ['limit', { default: 10 }],
    offset: 'offset',
    coachId: ['not_empty', 'uuid'],
    clubId: ['not_empty', 'uuid'],
    settlementId: ['not_empty', 'uuid'],
    sex: ['string', { min_length: 1 }, { max_length: 100 }],
    group: [{ one_of: ['A', 'B', null] }],
    include: [
      'to_array',
      { list_of: { one_of: ['category', 'coach', 'club', 'fighter'] } },
      { default: [[]] },
    ],
  };

  async execute({ limit, offset, include, ...rest }) {
    const filters = Object.entries(rest).map((filter) => ({ method: filter }));

    const { rows, count } = await Fighter.scope(...include, ...filters).findAndCountAll({
      limit,
      offset,
      order: [
        ['lastName', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    return {
      data: rows.map(dumpFighter),
      meta: {
        filteredCount: count,
        limit,
        offset,
      },
    };
  }
}
