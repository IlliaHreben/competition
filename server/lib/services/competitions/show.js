import ServiceBase          from '../Base.js';
import { dumpCompetition }  from '../../utils';

import Competition          from '../../models/Competition.js';
import { ServiceError }     from '../service-error';

export default class CompetitionShow extends ServiceBase {
    static validationRules = {
      id: [ 'required', 'uuid' ]
    };

    async execute ({ id }) {
      const competition = await Competition.findById(id, {
        include: [ 'FightSpaces', 'Categories' ]
      });

      if (!competition) throw new ServiceError('NOT_FOUND', { id });

      return {
        data: dumpCompetition(competition)
      };
    }
}
