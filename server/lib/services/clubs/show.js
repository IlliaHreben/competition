import ServiceBase  from '../Base.js';
import { dumpClub } from '../../utils';

import Club         from '../../models/Club.js';
import ServiceError from '../service-error.js';

export default class ClubsShow extends ServiceBase {
    static validationRules = {
      id      : [ 'required', 'uuid' ],
      include : [ 'to_array', { list_of: { one_of: [ 'coaches', 'settlement' ] } } ]
    };

    async execute ({ include = [], id }) {
      const club = await Club.scope(...include).findById(id);
      if (!club) throw new ServiceError('NOT_FOUND', { id });

      return {
        data: dumpClub(club)
      };
    }
}
