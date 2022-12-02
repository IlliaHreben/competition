import ServiceBase from '../Base.js';
import { dumpFight } from '../../utils';

import Fight from '../../models/Fight.js';
import ServiceError from '../service-error';

function checkAllFightsAreInOrder(fights) {
  let previousFight = null;
  for (const fight of fights) {
    if (previousFight) {
      if (fight.fightSpaceId !== previousFight.fightSpaceId) {
        throw new ServiceError('WRONG_FIGHTS_ORDER');
      }
      if (fight.serialNumber !== previousFight.serialNumber + 1) {
        throw new ServiceError('WRONG_FIGHTS_ORDER');
      }
    }
    previousFight = fight;
  }
}

export default class FightSetWinner extends ServiceBase {
  static validationRules = {
    fightSpaceId: ['required', 'uuid'],
    id: ['required', 'to_array', { list_of: ['required', 'uuid'] }],
    place: ['required', 'integer', { min_number: 1 }],
  };

  async execute({ fightSpaceId, id, place }) {
    const fights = await Fight.findAll({ where: { id }, order: [['serialNumber', 'ASC']] });

    checkAllFightsAreInOrder(fights);

    if (fights.length !== id.length) {
      throw new ServiceError('NOT_FOUND', {
        idsNotFound: id.filter((id) => !fights.find((fight) => fight.id === id)),
      });
    }

    const fightSpaces = [...new Set(fights.map((f) => f.fightSpaceId))];
    if (fightSpaces.length > 1) throw new ServiceError('NOT_FOUND', { id });
    const originalFightSpaceId = fightSpaces[0];

    await Fight.shiftSerialNumber({
      fightSpaceId,
      from: place,
      offset: fights.length,
      side: '+',
    });

    await Promise.all(fights.map((f) => f.reload()));
    const lastFightSerialNumber = fights.at(-1).serialNumber + 1;

    fights.forEach((fight, index) => {
      fight.serialNumber = place + index;
      fight.fightSpaceId = fightSpaceId;
    });

    // await Fight.bulkCreate(, { updateOnDuplicate: ['serialNumber', 'fightSpaceId'] });
    await Promise.all(fights.map((fight) => fight.save()));

    await Fight.shiftSerialNumber({
      fightSpaceId: originalFightSpaceId,
      from: lastFightSerialNumber,
      offset: fights.length,
      side: '-',
    });

    return {
      data: fights.map(dumpFight),
    };
  }
}
