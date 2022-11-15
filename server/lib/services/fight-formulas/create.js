import ServiceBase from '../Base.js';
import { dumpFightFormula } from '../../utils';

import FightFormula from '../../models/FightFormula.js';
import Competition from '../../models/Competition.js';
import ServiceError from '../service-error.js';

export default class FightFormulasCreate extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],
    data: [
      'required',
      {
        nested_object: {
          sectionId: ['required', 'uuid'],
          weightFrom: ['required', 'positive_decimal'],
          weightTo: ['required', 'positive_decimal'],
          sex: ['required', { one_of: ['man', 'woman'] }],
          ageFrom: ['required', 'positive_decimal'],
          ageTo: ['required', 'positive_decimal'],
          degree: ['not_empty', 'positive_decimal'],
        },
      },
    ],
  };

  async execute({ competitionId, data }) {
    const competition = await Competition.findById(competitionId);
    if (!competition) throw new ServiceError('NOT_FOUND', { id: competitionId });

    // const fightFormulasToCheck = await FightFormula.findAll({
    //   where: {
    //     competitionId,
    //     sectionId,
    //     sex: data.sex,
    //     ageFrom: data.ageFrom,
    //     ageTo: data.ageTo,
    //   },
    // });

    // const errors = FightFormula.validateFightFormulas(fightFormulasToCheck, [data]);
    // if (errors.length) throw new ServiceError('CATEGORY_VALIDATION', errors);

    const fightFormula = await FightFormula.create(data);

    return {
      data: dumpFightFormula(fightFormula),
    };
  }
}
