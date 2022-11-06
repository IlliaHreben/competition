import ServiceBase from '../Base.js';
import { dumpSection } from '../../utils';
import ServiceError from '../service-error.js';

import Settlement from '../../models/Settlement.js';

export default class SectionDelete extends ServiceBase {
  static validationRules = {
    id: ['required', 'uuid'],
  };

  async execute({ id }) {
    const settlement = await Settlement.findById(id);
    if (!settlement) throw new ServiceError('NOT_FOUND', { id });

    await settlement.destroy();

    return {
      data: dumpSection(settlement),
    };
  }
}
