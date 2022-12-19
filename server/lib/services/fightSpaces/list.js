import ServiceBase from '../Base.js';
import { dumpFightSpace } from '../../utils';

import FightSpace from '../../models/FightSpace.js';
import Competition from '../../models/Competition.js';
import ServiceError from '../service-error.js';

export default class FightSpacesList extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],
  };

  async execute({ competitionId }) {
    const isExist = await Competition.findById(competitionId);

    if (!isExist) throw new ServiceError('NOT_FOUND', { id: competitionId });

    const fightSpaces = await FightSpace.findAll({
      where: { competitionId },
      order: [
        ['type', 'DESC'],
        ['orderNumber', 'ASC'],
      ],
    });

    return {
      data: fightSpaces.map(dumpFightSpace),
      meta: {
        filteredCount: fightSpaces.length,
      },
    };
  }
}
