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

    sort: [
      { one_of: ['section', 'degree', 'ageFrom', 'ageTo', 'weightFrom', 'weightTo', 'sex'] },
      { default: 'ageFrom' },
    ],
    order: [{ one_of: ['asc', 'desc'] }, { default: 'asc' }],
    limit: ['positive_integer'],
    offset: ['integer', { min_number: 0 }],
    include: ['to_array', { list_of: { one_of: ['cards', 'section'] } }],
  };

  async execute({ sort, order, include, ...query }) {
    sort = sort === 'section' ? ['Section', 'name', order] : [sort, order];

    const { rows, count } = await FightFormula.findAndCountAll({
      where: query,
      order: [sort, ['id', 'desc']],
      include: include.map(fromCapital),
    });

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

const fromCapital = (str) => str[0].toUpperCase() + str.slice(1);
