import ServiceBase from '../Base.js';
import { dumpFightFormula } from '../../utils';

import FightFormula from '../../models/FightFormula.js';
import Competition from '../../models/Competition.js';
import Section from '../../models/Section.js';
import ServiceError from '../service-error.js';

export default class BulkFightFormulasCreate extends ServiceBase {
  async validate2(payload) {
    const groupValidationRule = ['required', { one_of: ['A', 'B'] }];
    const dataRules = {
      weightFrom: ['required', 'positive_decimal'],
      weightTo: ['required', 'positive_decimal'],
      sex: ['required', { one_of: ['man', 'woman'] }],
      ageFrom: ['required', 'positive_decimal'],
      ageTo: ['required', 'positive_decimal'],
      sectionId: ['required', 'uuid'],
      degree: ['not_empty', 'positive_decimal'],
    };

    if (payload.sectionId) {
      const sectionType = (await Section.findById(payload.sectionId))?.type;
      if (!sectionType) throw new ServiceError('NOT_FOUND', { id: payload.sectionId });
      if (sectionType === 'full') dataRules.group = groupValidationRule;
    }

    const validationRules = {
      competitionId: [{ required_if_not_present: 'sectionId' }, 'uuid'],
      data: [
        'required',
        'not_empty_list',
        {
          list_of_objects: [dataRules],
        },
      ],
    };
    return this.doValidation(payload, validationRules);
  }

  async execute({ competitionId, data }) {
    if (competitionId) {
      const competition = await Competition.findById(competitionId);
      if (!competition) throw new ServiceError('NOT_FOUND', { id: competitionId });
    }

    // const sectionIds = data.map((item) => item.sectionId).filter(Boolean);
    // if (sectionIds.length) {
    //   const sections = await Section.findAll({ id: sectionIds });
    //   if (sections.length !== sectionIds.length) {
    //     const realSectionIds = sections.map((s) => s.id);
    //     const ids = sectionIds.filter((s) => !realSectionIds.includes(s.id)).join(',');
    //     throw new ServiceError('NOT_FOUND', { id: ids });
    //   }
    // }

    const fightFormulas = await FightFormula.bulkCreate(
      data.map((ff) => ({ ...ff, competitionId })),
      { validate: true }
    );

    return {
      data: fightFormulas.map(dumpFightFormula),
    };
  }
}
