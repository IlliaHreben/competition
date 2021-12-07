import ServiceBase   from '../Base.js';
import { dumpCoach } from '../../utils';

import Coach         from '../../models/Coach.js';
import ServiceError  from '../service-error.js';

export default class CoachesShow extends ServiceBase {
    static validationRules = {
      id      : [ 'required', 'uuid' ],
      include : [ 'to_array', { list_of: { one_of: [ 'clubs' ] } } ]
    };

    async execute ({ include = [], id }) {
      const coach = await Coach.scope(...include).findById(id);
      if (!coach) throw new ServiceError('NOT_FOUND', { id });

      return {
        data: dumpCoach(coach)
      };
    }
}
