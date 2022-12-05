import ServiceBase from '../Base.js';
import { dumpSection } from '../../utils';
import ServiceError from '../service-error.js';

import Card from '../../models/Card.js';

export default class CardDelete extends ServiceBase {
  static validationRules = {
    id: ['required', 'uuid'],
  };

  async execute({ id }) {
    const card = await Card.findById(id);
    if (!card) throw new ServiceError('NOT_FOUND', { id });

    const category = await Card.getCategory();

    await card.destroy();

    await category.calculateFights({ recalculate: true });

    return {
      data: dumpSection(card),
    };
  }
}
