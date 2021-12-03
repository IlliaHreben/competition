import ServiceBase     from '../Base.js';
import { dumpSection } from '../../utils';

import Settlement         from '../../models/Settlement.js';

export default class Settlementshow extends ServiceBase {
    static validationRules = {
      id      : [ 'required', 'uuid' ],
      include : [ 'to_array', { list_of: { one_of: [ 'categories' ] } }, { default: [ [] ] } ]
    };

    async execute ({ id, include }) {
      const settlement = await Settlement.scope(...include).findById(id);

      return {
        data: dumpSection(settlement)
      };
    }
}
