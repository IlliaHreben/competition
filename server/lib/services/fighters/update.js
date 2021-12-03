import ServiceBase     from '../Base.js';
import { dumpFighter } from '../../utils';
import ServiceError    from '../service-error.js';

import Fighter         from '../../models/Fighter.js';
import Category        from '../../models/Category.js';

export default class FighterUpdate extends ServiceBase {
    static validationRules = {
      id            : [ 'required', 'uuid' ],
      competitionId : [ { required_if: { 'data/sex': 'man' } }, { required_if: { 'data/sex': 'woman' } }, 'uuid' ],
      recalculate   : [ 'boolean', { default: true } ],
      data          : [ 'required', {
        nested_object: {
          name     : [ 'required', 'string', { min_length: 1 }, { max_length: 1000 } ],
          lastName : [ 'required', 'string', { min_length: 1 }, { max_length: 1000 } ],
          sex      : [ 'required', { one_of: [ 'man', 'woman' ] } ]
        }
      } ]
    };

    async execute ({ id, competitionId, recalculate, data }) {
      const fighter = await Fighter.findById(id);
      if (!fighter) throw new ServiceError('NOT_FOUND', { id });

      const needUpdateCategory = data.sex && data.sex !== fighter.sex;

      await fighter.update(data);

      if (needUpdateCategory && recalculate) {
        const oldCategories = await Category
          .scope('cardsWithFighters')
          .findAll({
            where: { '$Cards.Fighter.id$': id }
          });

        const cards = oldCategories.flatMap(c => c.Cards)
          .filter(card => card.Fighter.id === id);

        await Promise.all(cards.map(async card => {
          await card.assignCategory();
          await card.calculateFights();
        }));

        await Promise.all(oldCategories.map(category => category.calculateFights()));
      }

      return {
        data: dumpFighter(fighter)
      };
    }
}
