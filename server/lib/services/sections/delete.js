import ServiceBase     from '../Base.js';
import { dumpSection } from '../../utils';

import Section         from '../../models/Section.js';

export default class BulkCategoriesDelete extends ServiceBase {
    static validationRules = {
      id: [ 'required', 'uuid' ]
    };

    async execute ({ id }) {
      const section = await Section.findById(id);

      await section.destroy();

      return {
        data: dumpSection(section)
      };
    }
}
