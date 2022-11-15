import ServiceBase from '../Base.js';
import { dumpFightFormula } from '../../utils';

import FightFormula from '../../models/FightFormula.js';

export default class FightFormulasList extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],

    // search: ['string'],
    // coachId: ['not_empty', 'uuid'],
    // clubId: ['not_empty', 'uuid'],
    // sectionId: ['not_empty', 'uuid'],
    // settlementId: ['not_empty', 'uuid'],
    // sex: ['string', { min_length: 1 }, { max_length: 100 }],
    // group: [{ one_of: ['A', 'B', null] }],

    limit: ['positive_integer', { default: 10 }],
    offset: ['integer', { min_number: 0 }, { default: 0 }],
    // include: ['to_array', { list_of: { one_of: ['cards', 'sections'] } }],
  };

  async execute(query) {
    const { rows, count } = await FightFormula.findAndCountAll(query);

    return {
      data: rows.map(dumpFightFormula),
      meta: {
        filteredCount: count,
        limit: query.limit,
        offset: query.offset,
      },
    };
  }
}
