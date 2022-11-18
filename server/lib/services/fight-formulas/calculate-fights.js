// import { Op }           from '../../sequelize.js';
import ServiceBase from '../Base.js';
import { dumpFight } from '../../utils';

import FightFormula from '../../models/FightFormula.js';

export default class CalculateFightFormulaFights extends ServiceBase {
  static validationRules = {
    fightFormulaId: ['required', 'uuid'],
  };

  // 98972d62-373d-4229-a1a7-df7cde04b78f
  async execute({ fightFormulaId }) {
    const fightFormula = await FightFormula.findById(fightFormulaId);
    const fights = await fightFormula.calculateFights();

    return {
      data: fights.map(dumpFight),
      // meta : {
      //   totalCount,
      //   filteredCount,
      //   limit,
      //   offset
      // }
    };
  }
}
