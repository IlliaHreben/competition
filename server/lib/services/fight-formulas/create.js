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
          group: [{ one_of: ['A', 'B'] }],

          roundCount: ['required', 'positive_integer', { number_between: [1, 12] }],
          roundTime: ['required', 'positive_integer', { number_between: [1, 60 * 60] }],
          breakTime: ['required', 'positive_integer', { number_between: [1, 60 * 60] }],
        },
      },
    ],
  };

  async execute({ competitionId, data }) {
    const competition = await Competition.findById(competitionId);
    if (!competition) throw new ServiceError('NOT_FOUND', { id: competitionId });

    const isCrossing = await FightFormula.validateOnCrossing();

    if (isCrossing) throw new ServiceError('CROSSING_FORMULA', { id: isCrossing.id });

    const fightFormula = await FightFormula.create({ competitionId, data });

    return {
      data: dumpFightFormula(fightFormula),
    };
  }
}
