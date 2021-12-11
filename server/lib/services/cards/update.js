import ServiceBase  from '../Base.js';
import { dumpCard } from '../../utils';
import ServiceError from '../service-error.js';

import Card         from '../../models/Card.js';

export default class CardUpdate extends ServiceBase {
    static validationRules = {
      id   : [ 'required', 'uuid' ],
      data : [ 'required', {
        nested_object: {
          fighterId  : [ 'not_empty', 'uuid' ],
          sectionId  : [ 'not_empty', 'uuid' ],
          weight     : [ 'not_empty', { number_between: [ 0, 999 ] } ],
          realWeight : [ { number_between: [ 0, 999 ] } ],
          group      : [ { one_of: [ 'A', 'B' ] } ],
          birthDate  : [ 'not_empty', 'iso_date' ]
        }
      } ]
    };

    async execute ({ id, data }) {
      const card = await Card.findById(id);
      if (!card) throw new ServiceError('NOT_FOUND', { id });

      await card.updateCard(data);

      return {
        data: dumpCard(card)
      };
    }
}
