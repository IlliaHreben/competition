import ServiceBase  from '../Base.js';
import { dumpClub } from '../../utils';

import Club         from '../../models/Club.js';
import ServiceError from '../service-error.js';

export default class ClubsUpdate extends ServiceBase {
  static validationRules = {
    id   : [ 'required', 'uuid' ],
    data : [ 'required', {
      nested_object: {
        name         : [ 'not_empty', 'string', { min_length: 1 }, { max_length: 1000 } ],
        settlementId : [ 'not_empty', 'uuid' ]
      }
    } ],
    linked: {
      nested_object: {
        coaches: [ { list_of: [ 'not_empty', 'uuid' ] } ]
      }
    }
  };

  async execute ({ id, data, linked }) {
    const club = await Club.findById(id);
    if (!club) throw new ServiceError('CLUB_NOT_FOUND');

    await club.updateClub(data, linked);

    return {
      data: dumpClub(club)
    };
  }
}
