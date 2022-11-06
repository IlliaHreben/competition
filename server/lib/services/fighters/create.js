import ServiceBase from '../Base.js';
import { dumpFighter } from '../../utils';

import Fighter from '../../models/Fighter.js';

export default class FightersCreate extends ServiceBase {
  static validationRules = {
    data: [
      'required',
      {
        nested_object: {
          name: ['required', 'string', { min_length: 1 }, { max_length: 1000 }],
          lastName: ['required', 'string', { min_length: 1 }, { max_length: 1000 }],
          sex: ['required', { one_of: ['man', 'woman'] }],
          clubId: ['uuid'],
          secondaryClubId: ['not_empty', 'uuid'],
          coachId: ['uuid'],
          birthDate: ['iso_date'],
        },
      },
    ],
  };

  async execute({ data }) {
    const fighter = await Fighter.create(data);

    return {
      data: dumpFighter(fighter),
    };
  }
}
