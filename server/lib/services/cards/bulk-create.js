import ServiceBase from '../Base.js';
import { dumpCard } from '../../utils';

import Card from '../../models/Card.js';
import Category from '../../models/Category.js';

export default class CardsBulkCreate extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],
    data: [
      'required',
      {
        list_of_objects: [
          {
            fighterId: ['required', 'uuid'],
            sectionId: ['required', 'uuid'],
            weight: ['required', { number_between: [0, 999] }],
            realWeight: [{ number_between: [0, 999] }],
            group: [{ one_of: ['A', 'B'] }],
            birthDate: ['required', 'iso_date'],
          },
        ],
      },
    ],
  };

  async execute({ competitionId, data }) {
    const cardsWithCompetition = data.map((c) => ({ competitionId, ...c }));
    const cards = await Card.bulkCreate(cardsWithCompetition);

    const categoryIds = [...new Set(cards.map((c) => c.categoryId))];
    const categories = await Category.findAll({ where: { id: categoryIds } });
    await Promise.all(categories.map((category) => category.calculateFights()));
    await Promise.all(categories.map((category) => category.assignFightFormulaToFights()));

    return {
      data: cards.map(dumpCard),
      // meta : {
      //   totalCount,
      //   filteredCount,
      //   limit,
      //   offset
      // }
    };
  }
}
