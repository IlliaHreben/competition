import ServiceBase     from '../Base.js';
import { dumpSection } from '../../utils';
import ServiceError    from '../service-error.js';

import Section         from '../../models/Section.js';

export default class SectionDelete extends ServiceBase {
    static validationRules = {
      id: [ 'required', 'uuid' ]
    };

    async execute ({ id }) {
      const section = await Section.findById(id);
      if (!section) throw new ServiceError('NOT_FOUND', { id });

      await section.destroy();

      return {
        data: dumpSection(section)
      };
    }
}
