import ServiceBase     from '../Base.js';
import { dumpSection } from '../../utils';

import Section         from '../../models/Section.js';

export default class SectionShow extends ServiceBase {
    static validationRules = {
      id      : [ 'required', 'uuid' ],
      include : [ 'to_array', { list_of: { one_of: [ 'categories' ] } }, { default: [ [] ] } ]
    };

    async execute ({ id, include }) {
      const section = await Section.scope(...include).findById(id);

      return {
        data: dumpSection(section)
      };
    }
}
