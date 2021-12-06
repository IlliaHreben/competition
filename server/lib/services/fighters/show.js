import ServiceBase     from '../Base.js';
import { dumpFighter } from '../../utils';

import Fighter         from '../../models/Fighter.js';

export default class FighterShow extends ServiceBase {
    static validationRules = {
      id      : [ 'required', 'uuid' ],
      include : [ 'to_array', { list_of: { one_of: [ 'category', 'coach', 'club', 'fighter' ] } } ]
    };

    async execute ({ id, include = [] }) {
      const fighter = await Fighter.scope(...include).findById(id);

      return {
        data: dumpFighter(fighter)
      };
    }
}
