import ServiceBase   from '../Base.js';
import { dumpState } from '../../utils';

import State         from '../../models/State.js';

export default class StatesCreate extends ServiceBase {
    static validationRules = {
      data: [ 'required', {
        nested_object: {
          name: [ 'required', 'string', { max_length: 1000 } ]
        }
      } ]
    };

    async execute ({ data }) {
      const state = await State.create(data);

      return {
        data: dumpState(state)
      };
    }
}
