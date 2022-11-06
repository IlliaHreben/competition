import ServiceBase from '../Base.js';
import { dumpCompetition } from '../../utils';

import Competition from '../../models/Competition.js';
import ServiceError from '../service-error.js';

export default class CompetitionActivate extends ServiceBase {
  static validationRules = {
    id: ['required', 'uuid'],
  };

  async execute({ id }) {
    const competition = await Competition.findById(id);

    if (!competition) throw new ServiceError('NOT_FOUND', { id });

    await competition.update({ active: true });

    return {
      data: dumpCompetition(competition),
    };
  }
}
