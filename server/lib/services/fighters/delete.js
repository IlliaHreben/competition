import ServiceBase     from '../Base.js';
import { dumpSection } from '../../utils';
import ServiceError    from '../service-error.js';

import Fighter            from '../../models/Fighter.js';

export default class FighterDelete extends ServiceBase {
    static validationRules = {
      id: [ 'required', 'uuid' ]
    };

    async execute ({ id }) {
      const fighter = await Fighter.findById(id);
      if (!fighter) throw new ServiceError('NOT_FOUND', { id });

      await fighter.destroy();

      return {
        data: dumpSection(fighter)
      };
    }
}
