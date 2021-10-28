import ServiceBase              from '../Base.js';
import { dumpCompetition }      from '../../utils';

import Competition              from '../../models/Competition.js';

export default class CompetitionUpdate extends ServiceBase {
  static validationRules = {
    id   : [ 'required', 'uuid' ],
    data : [ 'required', {
      nested_object: {
        name         : [ 'required', 'string', { max_length: 1000 } ],
        description  : [ 'required', 'string', { max_length: 5000 } ],
        startDate    : [ 'required', 'iso_date' ],
        endDate      : [ 'required', 'iso_date' ],
        ringsCount   : [ 'required', 'positive_integer' ],
        tatamisCount : [ 'required', 'positive_integer' ]
      }
    } ]
  };

  async execute (data) {
    const competition = await Competition.editCompetition(data);

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
