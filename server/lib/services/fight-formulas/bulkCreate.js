import ServiceBase from '../Base.js';
import { dumpFightFormula } from '../../utils';

import FightFormula from '../../models/FightFormula.js';
import Competition from '../../models/Competition.js';
import Section from '../../models/Section.js';
import ServiceError from '../service-error.js';

export default class BulkFightFormulasCreate extends ServiceBase {
  async validate(payload) {
    const validationRules = {
      // TODO type should be only if sectionId is not presented and wise-versa
      type: ['not_empty', { one_of: ['full', 'light'] }],
      sectionId: ['not_empty', 'uuid'],
      weightFrom: ['not_empty', 'positive_decimal'],
      weightTo: ['not_empty', 'positive_decimal'],
      sex: ['not_empty', { one_of: ['man', 'woman'] }],
      ageFrom: ['not_empty', 'positive_decimal'],
      ageTo: ['not_empty', 'positive_decimal'],
      // TODO should be group only if type is full
      group: ['not_empty', { one_of: ['A', 'B'] }],
      degree: ['not_empty', 'positive_decimal'],
    };

    return this.doValidation(payload, {
      competitionId: ['required', 'uuid'],
      data: ['required', 'not_empty_list', { list_of_objects: [validationRules] }],
    });
  }

  async execute({ competitionId, data }) {
    if (competitionId) {
      const competition = await Competition.findById(competitionId);
      if (!competition) throw new ServiceError('NOT_FOUND', { id: competitionId });
    }

    const sectionIds = data.map((item) => item.sectionId).filter(Boolean);
    if (sectionIds.length) {
      const sections = await Section.findAll({ id: sectionIds });
      if (sections.length !== sectionIds.length) {
        const realSectionIds = sections.map((s) => s.id);
        const ids = sectionIds.filter((s) => !realSectionIds.includes(s.id)).join(',');
        throw new ServiceError('NOT_FOUND', { id: ids });
      }
    }

    const fightFormulas = await FightFormula.bulkCreate(
      data.map((ff) => ({ ...ff, competitionId })),
      { validate: true }
    );

    return {
      data: fightFormulas.map(dumpFightFormula),
    };
  }
}
