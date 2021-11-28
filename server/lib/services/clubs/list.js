import ServiceBase  from '../Base.js';
import { dumpClub } from '../../utils';

import Club         from '../../models/Club.js';

export default class ClubsList extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      coachId       : [ 'not_empty', 'uuid' ]
    };

    async execute ({ ...rest }) {
      const filters = Object.entries(rest).map(filter => ({ method: filter }));

      const { rows, count } = await Club
        .scope(...filters)
        .findAndCountAll();

      return {
        data : rows.map(dumpClub),
        meta : {
          filteredCount: count
        }
      };
    }
}
