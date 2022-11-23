import ServiceBase from '../Base.js';
import { dumpFightFormula } from '../../utils';

import FightFormula from '../../models/FightFormula.js';
import Section from '../../models/Section.js';
import ServiceError from '../service-error.js';

export default class BulkCreateFightFormulas extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],
    data: [
      'required',
      'not_empty_list',
      {
        list_of_objects: {
          weightFrom: ['required', { number_between: [0, 999] }],
          weightTo: ['required', { number_between: [0, 999] }, { bigger_than: 'weightFrom' }],
          sex: ['required', { one_of: ['man', 'woman'] }],
          ageFrom: ['required', 'integer', { number_between: [0, 999] }],
          ageTo: ['required', 'integer', { number_between: [0, 999] }, { bigger_than: 'ageFrom' }],
          sectionId: ['required', 'uuid'],
          degree: ['not_empty', 'positive_decimal'],
          group: ['not_empty', { one_of: ['A', 'B'] }],

          roundCount: ['required', 'integer', { number_between: [1, 12] }],
          roundTime: ['required', 'integer', { number_between: [1, 60 * 60] }],
          breakTime: ['required', 'integer', { number_between: [1, 60 * 60] }],
        },
      },
    ],
  };

  async execute({ competitionId, data }) {
    const sectionIds = [...new Set(data.map((item) => item.sectionId).filter(Boolean))];
    const sections = await Section.findAll({ where: { id: sectionIds } });

    if (sections.length !== sectionIds.length) {
      const realSectionIds = sections.map((s) => s.id);
      const ids = sectionIds.filter((s) => !realSectionIds.includes(s.id)).join(',');
      throw new ServiceError('NOT_FOUND', { id: ids });
    }

    data.forEach((item, _, arr) => {
      const section = sections.find((s) => s.id === item.sectionId);
      if (section.type === 'light') delete item.group;
      else if (section.type === 'full' && !item.group) {
        item.group = 'A';
        arr.push({ ...item, group: 'B' });
      }
    });

    await Promise.all(
      data.map(async (ff) => {
        ff.competitionId = competitionId;
        const isCrossing = await FightFormula.validateOnCrossing(ff);
        if (isCrossing)
          throw new ServiceError('CROSSING_FORMULA', {
            id: isCrossing.id,
          });
      })
    );

    const fightFormulas = await FightFormula.bulkCreate(data, { validate: true });

    return {
      data: fightFormulas.map(dumpFightFormula),
    };
  }
}
