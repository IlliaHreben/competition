import ServiceBase        from '../Base.js';
import { dumpSettlement } from '../../utils';

import Settlement         from '../../models/Settlement.js';
import State              from '../../models/State.js';
import ServiceError       from '../service-error.js';

export default class SettlementsCreate extends ServiceBase {
    static validationRules = {
      data: [ 'required', {
        nested_object: {
          stateId : [ 'required', 'uuid' ],
          name    : [ 'required', 'string', { max_length: 1000 } ]
        }
      } ]
    };

    async execute ({ data }) {
      const state = await State.findById(data.stateId);
      if (!state) throw new ServiceError('NOT_FOUND', { id: data.stateId });

      const settlement = await Settlement.create(data);

      return {
        data: dumpSettlement(settlement)
      };
    }
}
