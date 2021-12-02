import ServiceBase     from '../Base.js';
import { dumpFighter } from '../../utils';

import Fighter         from '../../models/Fighter.js';

export default class FightersList extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      limit         : [ 'positive_integer', { default: 10 } ],
      offset        : [ 'integer', { min_number: 0 }, { default: 0 } ],
      coachId       : [ 'not_empty', 'uuid' ],
      clubId        : [ 'not_empty', 'uuid' ],
      sectionId     : [ 'not_empty', 'uuid' ],
      settlementId  : [ 'not_empty', 'uuid' ],
      sex           : [ 'string', { min_length: 1 }, { max_length: 100 } ],
      group         : [ { one_of: [ 'A', 'B', null ] } ],
      include       : [ 'to_array', { list_of: { one_of: [ 'category', 'coach', 'club', 'fighter' ] } }, { default: [ [] ] } ]
    };

    async execute ({ competitionId, limit, offset, include, ...rest }) {
      const filters = Object.entries(rest).map(filter => ({ method: filter }));

      const { rows, count } = await Fighter
        .scope(...include, ...filters, { method: [ 'competitionRelated', competitionId ] })
        .findAndCountAll({
          limit,
          offset
        // order: [ [ sort, order ] ]
        });

      return {
        data : rows.map(dumpFighter),
        meta : {
          filteredCount: count,
          limit,
          offset
        }
      };
    }
}
