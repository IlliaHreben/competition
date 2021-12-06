import ServiceBase     from '../Base.js';
import { dumpSection } from '../../utils';

import Settlement      from '../../models/Settlement.js';

export default class SettlementsList extends ServiceBase {
  static validationRules = {
    competitionId : [ 'uuid' ],
    search        : [ 'string', { max_length: 300 } ],
    limit         : [ { required_if_not_present: 'competitionId' }, { min_length: 1 }, { max_length: 1000 }, { default: 10 } ]
  };

  async execute ({ limit, ...rest }) {
    const scopes = Object.entries(rest).map(filter => ({ method: filter }));

    const rows = await Settlement
      .scope(...scopes)
      .findAll({
        limit
      });

    return {
      data: rows.map(dumpSection)
    };
  }
}
