import ServiceBase from '../Base.js';
import { dumpFightFormula } from '../../utils';

import FightFormula from '../../models/FightFormula.js';
export default class ShowFightFormula extends ServiceBase {
  static validationRules = {
    id: ['required', 'uuid'],
    include: ['to_array', { list_of: { one_of: ['cards', 'sections'] } }],
  };

  async execute({ id, include = [] }) {
    const fightFormula = await FightFormula.scope(...include).findById(id);

    return {
      data: dumpFightFormula(fightFormula),
    };
  }
}
