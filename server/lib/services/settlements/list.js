import ServiceBase     from '../Base.js';
import { dumpSection } from '../../utils';

import Settlement      from '../../models/Settlement.js';
import Club            from '../../models/Club.js';
import Card            from '../../models/Card.js';

export default class SettlementsList extends ServiceBase {
  static validationRules = {
    competitionId: [ 'required', 'uuid' ]
  };

  async execute ({ competitionId }) {
    const rows = await Settlement
      .findAll({
        include: {
          model   : Club,
          as      : 'Clubs',
          include : {
            model    : Card,
            as       : 'Cards',
            where    : { competitionId },
            required : true
          },
          required: true
        }
      });

    return {
      data: rows.map(dumpSection)
    };
  }
}
