import ServiceBase              from '../Base.js';
import { dumpCompetition }      from '../../utils';

import Competition              from '../../models/Competition.js';
import { ServiceError }         from '../service-error.js';

export default class CompetitionUpdate extends ServiceBase {
  static validationRules = {
    id   : [ 'required', 'uuid' ],
    data : [ 'required', {
      nested_object: {
        name        : [ 'string', { max_length: 1000 } ],
        description : [ 'string', { max_length: 5000 } ],
        startDate   : [ 'iso_date' ],
        endDate     : [ 'iso_date' ]
      }
    } ]
  };

  async execute ({ id, data }) {
    const competition = await Competition.findById(id);

    if (!competition) throw new ServiceError('NOT_FOUND', { id });

    await competition.update(data);

    return {
      data: dumpCompetition(competition)
      // meta : {
      //   totalCount,
      //   filteredCount,
      //   limit,
      //   offset
      // }
    };
  }
}
