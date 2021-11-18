import ServiceBase              from '../Base.js';
import { dumpFightSpace }       from '../../utils';

import Competition              from '../../models/Competition.js';
import ServiceError             from '../service-error.js';

export default class BulkFightSpaceUpdate extends ServiceBase {
  static validationRules = {
    competitionId : [ 'required', 'uuid' ],
    data          : [ 'required', {
      list_of_objects: [ {
        id             : [ 'uuid' ],
        competitionDay : [ 'required', 'positive_integer' ],
        type           : [ 'required', 'string', { one_of: [ 'ring', 'tatami' ] } ],
        orderNumber    : [ 'required', 'positive_integer' ]
      } ]
    } ]
  };

  async execute ({ competitionId, data }) {
    const competition = await Competition.findById(competitionId);

    if (!competition) throw new ServiceError('NOT_FOUND', { id: competitionId });

    const spaces = await competition.recalculateFightSpaces(data);

    return {
      data: spaces.map(dumpFightSpace)
    };
  }
}
