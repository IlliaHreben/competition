import ServiceBase   from '../Base.js';
import { dumpCoach } from '../../utils';

import Coach         from '../../models/Coach.js';
import ServiceError  from '../service-error.js';

export default class CoachesUpdate extends ServiceBase {
  static validationRules = {
    id   : [ 'required', 'uuid' ],
    data : [ 'required', {
      nested_object: {
        name        : [ 'not_empty', 'string', { min_length: 1 }, { max_length: 1000 } ],
        lastName    : [ 'not_empty', 'string', { min_length: 1 }, { max_length: 1000 } ],
        assistantId : [ 'not_empty', 'uuid' ]
      }
    } ],
    linked: {
      nested_object: {
        clubs: [ { list_of: [ 'not_empty', 'uuid' ] } ]
      }
    }
  };

  async execute ({ id, data, linked }) {
    const coach = await Coach.findById(id);
    if (!coach) throw new ServiceError('NOT_FOUND', { id });

    await coach.updateCoach(data, linked);

    return {
      data: dumpCoach(coach)
    };
  }
}
