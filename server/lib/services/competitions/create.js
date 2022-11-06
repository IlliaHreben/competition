import ServiceBase from '../Base.js';
import { dumpCompetition } from '../../utils';

import Competition from '../../models/Competition.js';

export default class CompetitionCreate extends ServiceBase {
  static validationRules = {
    name: ['required', 'string', { max_length: 1000 }],
    description: ['required', 'string', { max_length: 5000 }],
    startDate: ['required', 'iso_date', { date_before: 'endDate' }],
    endDate: ['required', 'iso_date', { date_after: 'startDate' }],
    ringsCount: ['required', 'positive_integer'],
    tatamisCount: ['required', 'positive_integer'],
  };

  async execute(data) {
    const competition = await Competition.createCompetition(data);

    return {
      data: dumpCompetition(competition),
      // meta : {
      //   totalCount,
      //   filteredCount,
      //   limit,
      //   offset
      // }
    };
  }
}
