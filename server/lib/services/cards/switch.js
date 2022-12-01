import ServiceBase from '../Base.js';
import { dumpCard } from '../../utils';

import Card from '../../models/Card.js';
import Fight from '../../models/Fight.js';
import ServiceError from '../service-error';

export default class SwitchCards extends ServiceBase {
  static validationRules = {
    first: [
      'required',
      {
        nested_object: {
          fightId: ['required', 'uuid'],
          position: ['required', { one_of: ['firstCardId', 'secondCardId'] }],
        },
      },
    ],
    second: [
      'required',
      {
        nested_object: {
          fightId: ['required', 'uuid'],
          position: ['required', { one_of: ['firstCardId', 'secondCardId'] }],
        },
      },
    ],
  };

  async execute({ first, second }) {
    const firstFight = await Fight.findOne({ where: { id: first.fightId } });
    const secondFight = await Fight.findOne({ where: { id: second.fightId } });

    const previousFights = await Promise.all(
      [firstFight, secondFight].map((fight) => fight.getPreviousFights({ limit: 1 }))
    );
    if (previousFights.flat().length) throw new ServiceError('FIGHT_IS_NOT_FIRST');

    const firstCard = await Card.findOne({ where: { id: firstFight[first.position] } });
    const secondCard = await Card.findOne({ where: { id: secondFight[second.position] } });

    if (!firstCard && !secondCard) throw new ServiceError('CANNOT_MOVE_EMPTY_CARD');

    if (firstCard) {
      await firstCard.update({
        fightId: second.fightId,
        sectionId: secondCard.sectionId,
        categoryId: secondCard.categoryId,
      });
    }
    if (secondCard) {
      await secondCard.update({
        fightId: first.fightId,
        sectionId: firstCard.sectionId,
        categoryId: firstCard.categoryId,
      });
    }

    const nextFirstFight = await firstFight.getNextFight();
    const firstWinnerAlreadyExist = !!firstFight.winnerId;
    if (firstWinnerAlreadyExist) await nextFirstFight?.clearWinStreak(firstFight.winnerId);

    const nextSecondFight = await secondFight.getNextFight();
    const secondWinnerAlreadyExist = !!secondFight.winnerId;
    if (secondWinnerAlreadyExist) await nextSecondFight?.clearWinStreak(secondFight.winnerId);

    await firstFight.update({ [first.position]: secondCard?.id });
    await secondFight.update({ [second.position]: firstCard?.id });

    return {
      data: [firstCard, secondCard].map(dumpCard),
    };
  }
}