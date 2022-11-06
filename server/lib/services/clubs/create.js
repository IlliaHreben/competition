import ServiceBase from '../Base.js';
import { dumpClub } from '../../utils';

import Club from '../../models/Club.js';
import Settlement from '../../models/Settlement.js';
import ServiceError from '../service-error.js';

export default class ClubsCreate extends ServiceBase {
  static validationRules = {
    data: [
      'required',
      {
        nested_object: {
          name: ['required', 'string', { min_length: 1 }, { max_length: 1000 }],
          settlementId: ['required', 'uuid'],
        },
      },
    ],
    linked: {
      nested_object: {
        coaches: [{ list_of: ['not_empty', 'uuid'] }],
      },
    },
  };

  async execute({ data, linked }) {
    const settlement = await Settlement.findById(data.settlementId);
    if (!settlement) throw new ServiceError('SETTLEMENT_NOT_FOUND');
    const club = await Club.create(data);

    if (linked.coaches) await club.associateCoaches(linked.coaches);

    return {
      data: dumpClub(club),
    };
  }
}
