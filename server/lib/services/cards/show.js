import ServiceBase  from '../Base.js';
import { dumpCard } from '../../utils';

import Card         from '../../models/Card.js';

export default class CardShow extends ServiceBase {
    static validationRules = {
      id      : [ 'required', 'uuid' ],
      include : [ 'to_array', { list_of: { one_of: [ 'category', 'coach', 'club', 'fighter' ] } } ]
    };

    async execute ({ id, include = [] }) {
      const card = await Card.scope(...include).findById(id);

      return {
        data: dumpCard(card)
      };
    }
}
