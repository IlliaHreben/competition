import ServiceBase  from '../Base.js';
import { dumpCard } from '../../utils';

import Card         from '../../models/Card.js';
import ServiceError from '../service-error.js';

export default class CardShow extends ServiceBase {
    static validationRules = {
      id      : [ 'required', 'uuid' ],
      include : [ 'to_array', { list_of: { one_of: [ 'category', 'coach', 'club', 'fighter' ] } } ]
    };

    async execute ({ id, include = [] }) {
      const card = await Card.scope(...include).findById(id);
      if (!card) throw new ServiceError('NOT_FOUND', { id });

      return {
        data: dumpCard(card)
      };
    }
}
