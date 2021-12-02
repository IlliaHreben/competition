import ServiceBase     from '../Base.js';
import { dumpFighter } from '../../utils';
import ServiceError    from '../service-error.js';

import Fighter         from '../../models/Fighter.js';

export default class FighterUpdate extends ServiceBase {
    static validationRules = {
      id   : [ 'required', 'uuid' ],
      data : [ 'required', {
        nested_object: {
          fighterId       : [ 'not_empty', 'uuid' ],
          clubId          : [ 'not_empty', 'uuid' ],
          secondaryClubId : [ 'uuid' ],
          coachId         : [ 'not_empty', 'uuid' ],
          sectionId       : [ 'not_empty', 'uuid' ],
          weight          : [ 'not_empty', { number_between: [ 0, 999 ] } ],
          realWeight      : [ { number_between: [ 0, 999 ] } ],
          group           : [ { one_of: [ 'A', 'B' ] } ],
          birthDate       : [ 'not_empty', 'iso_date' ]
        }
      } ]
    };

    async execute ({ id, data }) {
      const fighter = await Fighter.findById(id);
      if (!fighter) throw new ServiceError('NOT_FOUND', { id });

      await fighter.updateFighter(data);

      return {
        data: dumpFighter(fighter)
      };
    }
}
