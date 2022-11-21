import ServiceBase from '../Base.js';
import { dumpFightFormula } from '../../utils';

import FightFormula from '../../models/FightFormula.js';
import Section from '../../models/Section.js';
import ServiceError from '../service-error.js';

export default class BulkFightFormulasCreate extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],
    data: [
      'required',
      'not_empty_list',
      {
        list_of_objects: {
          weightFrom: ['required', 'positive_decimal'],
          weightTo: ['required', 'positive_decimal'],
          sex: ['required', { one_of: ['man', 'woman'] }],
          ageFrom: ['required', 'positive_decimal'],
          ageTo: ['required', 'positive_decimal'],
          sectionId: ['required', 'uuid'],
          degree: ['not_empty', 'positive_decimal'],
          group: ['not_empty', { one_of: ['A', 'B'] }],

          roundCount: ['required', 'positive_integer', { number_between: [1, 12] }],
          roundTime: ['required', 'positive_integer', { number_between: [1, 60 * 60] }],
          breakTime: ['required', 'positive_integer', { number_between: [1, 60 * 60] }],
        },
      },
    ],
  };

  async execute({ competitionId, data }) {
    const sectionIds = data.map((item) => item.sectionId).filter(Boolean);
    const sections = await Section.findAll({ id: sectionIds });
    if (sections.length !== sectionIds.length) {
      const realSectionIds = sections.map((s) => s.id);
      const ids = sectionIds.filter((s) => !realSectionIds.includes(s.id)).join(',');
      throw new ServiceError('NOT_FOUND', { id: ids });
    }

    data.forEach((item) => {
      const section = sections.find((s) => s.id === item.sectionId);
      if (section.type === 'light') delete item.group;
    });

    const fightFormulas = await FightFormula.bulkCreate(
      data.map((item) => ({ competitionId, ...item })),
      { validate: true }
    );

    return {
      data: fightFormulas.map(dumpFightFormula),
    };
  }
}
