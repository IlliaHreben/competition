import ServiceBase from '../Base.js';
import { dumpSection } from '../../utils';

import Section from '../../models/Section.js';

export default class SectionsList extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],
    limit: ['positive_integer', { default: 10 }],
    offset: ['integer', { min_number: 0 }, { default: 0 }],
    include: ['to_array', { list_of: { one_of: ['categories'] } }, { default: [[]] }],
  };

  async execute({ competitionId, limit, offset, include }) {
    const { rows, count } = await Section.scope(...include).findAndCountAll({
      where: {
        competitionId,
      },
      limit,
      offset,
      // order: [ [ sort, order ] ]
    });

    return {
      data: rows.map(dumpSection),
      meta: {
        filteredCount: count,
        limit,
        offset,
      },
    };
  }
}
