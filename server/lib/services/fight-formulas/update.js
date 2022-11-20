import ServiceBase from '../Base.js';
import { dumpFightFormula } from '../../utils';

import FightFormula from '../../models/FightFormula.js';
import ServiceError from '../service-error.js';

export default class FightFormulaUpdate extends ServiceBase {
  static validationRules = {
    id: ['required', 'uuid'],
    data: [
      'required',
      {
        nested_object: {
          sectionId: ['not_empty', 'uuid'],
          weightFrom: ['not_empty', 'positive_decimal'],
          weightTo: ['not_empty', 'positive_decimal', { bigger_than: 'weightFrom' }],
          sex: ['not_empty', { one_of: ['man', 'woman'] }],
          ageFrom: ['not_empty', 'positive_decimal'],
          ageTo: ['not_empty', 'positive_decimal', { bigger_than: 'weightFrom' }],
          degree: ['not_empty', 'positive_decimal'],
        },
      },
    ],
  };

  async execute({ id, data }) {
    const fightFormula = await FightFormula.findById(id);

    if (!fightFormula) throw new ServiceError('NOT_FOUND', { id });

    await fightFormula.update(data);

    return {
      data: dumpFightFormula(fightFormula),
    };
  }
}
