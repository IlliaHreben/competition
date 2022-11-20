import ServiceBase from '../Base.js';
import { dumpFightFormula } from '../../utils';

import FightFormula from '../../models/FightFormula.js';
import Fight from '../../models/Fight.js';
import ServiceError from '../service-error.js';

export default class FightFormulaDelete extends ServiceBase {
  static validationRules = {
    id: ['required', 'uuid'],
  };

  async execute({ id }) {
    const fightFormula = await FightFormula.findById(id, {
      include: { model: Fight, as: 'Fights', limit: 1 },
    });

    if (!fightFormula) throw new ServiceError('NOT_FOUND', { id });
    if (fightFormula.Fights.length)
      throw new ServiceError('RELATED_INSTANCES', { fights: [fightFormula.Fights[0].id] });

    await fightFormula.destroy();

    return {
      data: dumpFightFormula(fightFormula),
    };
  }
}
