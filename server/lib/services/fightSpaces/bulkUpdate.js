import ServiceBase              from '../Base.js';
import { dumpFightSpace }       from '../../utils';

import Competition              from '../../models/Competition.js';
import { ServiceError }         from '../service-error.js';

export default class BulkFightSpaceUpdate extends ServiceBase {
  static validationRules = {
    competitionId : [ 'required', 'uuid' ],
    data          : [ 'required', {
      list_of_objects: [ {
        id          : [ 'uuid' ],
        day         : [ 'required', 'positive_integer' ],
        type        : [ 'required', 'string', { max_length: 5000 } ],
        orderNumber : [ 'required', 'positive_integer' ]
      } ]
    } ]
  };

  async execute ({ id, data }) {
    const competition = await Competition.findById(id);

    if (!competition) throw new ServiceError('NOT_FOUND', { id });

    const spaces = await competition.recalculateFightSpaces(data);

    return {
      data: spaces.map(dumpFightSpace)
    };
  }
}
