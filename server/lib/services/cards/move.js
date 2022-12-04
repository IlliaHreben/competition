import ServiceBase from '../Base.js';
import { dumpCard, dumpCategory } from '../../utils';

import Card from '../../models/Card.js';
import Category from '../../models/Category.js';
import ServiceError from '../service-error';

export default class MoveCard extends ServiceBase {
  static validationRules = {
    categoryId: ['required', 'uuid'],
    id: ['required', 'uuid'],
  };

  async execute({ categoryId, id }) {
    const category = await Category.findById(categoryId);
    if (!category) throw new ServiceError('NOT_FOUND', { categoryId });

    const card = await Card.findById(id, { include: ['Category'] });
    if (!card) throw new ServiceError('NOT_FOUND', { id });

    const { from, to } = await card.moveCardToCategory(category);

    return {
      card: dumpCard(card),
      from: dumpCategory(from),
      to: dumpCategory(to),
    };
  }
}
