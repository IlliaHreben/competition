import ServiceBase from '../Base.js';
import { dumpFightFormula } from '../../utils';

import FightFormula from '../../models/FightFormula.js';

export default class FightFormulasList extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],
    sort: [
      {
        one_of: [
          'roundCount',
          'roundTime',
          'breakTime',
          'section',
          'degree',
          'ageFrom',
          'ageTo',
          'weightFrom',
          'weightTo',
          'group',
          'sex',
        ],
      },
      { default: 'ageFrom' },
    ],
    order: [{ one_of: ['asc', 'desc'] }, { default: 'asc' }],
    limit: ['positive_integer'],
    offset: ['integer', { min_number: 0 }],
    include: [
      'to_array',
      { list_of: { one_of: ['cards', 'section'] } },
      { default: [['section']] },
    ],
  };

  async execute({ sort, order, include, ...query }) {
    sort = sort === 'section' ? ['Section', 'name', order] : [sort, order];

    const rows = await FightFormula.findAll({
      where: query,
      order: [sort, ['id', 'desc']],
      include: include.map(fromCapital),
    });

    return {
      data: rows.map(dumpFightFormula),
      meta: {
        filteredCount: rows.length,
        limit: query.limit,
        offset: query.offset,
      },
    };
  }
}

const fromCapital = (str) => str[0].toUpperCase() + str.slice(1);
