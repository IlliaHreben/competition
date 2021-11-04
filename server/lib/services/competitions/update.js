import ServiceBase              from '../Base.js';
import { dumpCompetition }      from '../../utils';

import Competition              from '../../models/Competition.js';
import { ServiceError }         from '../service-error.js';

export default class CompetitionUpdate extends ServiceBase {
  static validationRules = {
    id   : [ 'required', 'uuid' ],
    data : [ 'required', {
      nested_object: {
        name        : [ 'required', 'string', { max_length: 1000 } ],
        description : [ 'required', 'string', { max_length: 5000 } ],
        startDate   : [ 'required', 'iso_date', { date_before: 'endDate' } ],
        endDate     : [ 'required', 'iso_date', { date_after: 'startDate' } ]
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
