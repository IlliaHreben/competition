import ServiceBase  from '../Base.js';
import { dumpCard } from '../../utils';

import Card         from '../../models/Card.js';
import Competition  from '../../models/Competition.js';
import ServiceError from '../service-error';

export default class CardsBulkCreate extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      data          : [ 'required', {
        nested_object: {
          fighterId  : [ 'required', 'uuid' ],
          sectionId  : [ 'required', 'uuid' ],
          weight     : [ 'required', { number_between: [ 0, 999 ] } ],
          realWeight : [ { number_between: [ 0, 999 ] } ],
          group      : [ { one_of: [ 'A', 'B' ] } ],
          birthDate  : [ 'required', 'iso_date' ]
        }
      } ]
    };

    async execute ({ competitionId, data }) {
      const competition = await Competition.findById(competitionId);
      if (!competition) throw new ServiceError('NOT_FOUND', { id: competitionId });

      const card = await Card.createCard({ competitionId, ...data });

      return {
        data: dumpCard(card)
      };
    }
}
