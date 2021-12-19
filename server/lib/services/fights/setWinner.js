import ServiceBase   from '../Base.js';
import { dumpFight } from '../../utils';

import Fight         from '../../models/Fight.js';
import ServiceError  from '../service-error';

export default class FightSetWinner extends ServiceBase {
    static validationRules = {
      id       : [ 'required', 'uuid' ],
      winnerId : [ 'required', 'uuid' ]
    };

    async execute ({ id, winnerId }) {
      const fight = await Fight.findById(id);
      if (!fight) throw new ServiceError('NOT_FOUND', { id });

      await fight.setWinner(winnerId);

      return {
        data: dumpFight(fight)
      };
    }
}
