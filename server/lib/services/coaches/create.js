import ServiceBase from '../Base.js';
import { dumpCoach } from '../../utils';

import Coach from '../../models/Coach.js';
import Club from '../../models/Club.js';

export default class CoachesCreate extends ServiceBase {
  static validationRules = {
    data: [
      'required',
      {
        nested_object: {
          name: ['required', 'string', { min_length: 1 }, { max_length: 1000 }],
          lastName: ['required', 'string', { min_length: 1 }, { max_length: 1000 }],
          assistantId: ['not_empty', 'uuid'],
        },
      },
    ],
    linked: {
      nested_object: {
        clubs: [{ list_of: ['not_empty', 'uuid'] }],
      },
    },
  };

  async execute({ data, linked }) {
    const coach = await Coach.create(data);
    if (linked.clubs) {
      const clubs = await Club.findAll({ where: { id: linked.clubs } });
      await coach.addClubs(clubs);
      coach.Clubs = clubs;
    }

    return {
      data: dumpCoach(coach),
    };
  }
}
