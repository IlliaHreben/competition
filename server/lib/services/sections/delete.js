import ServiceBase     from '../Base.js';
import { dumpSection } from '../../utils';
import ServiceError    from '../service-error.js';

import Section         from '../../models/Section.js';
import Card            from '../../models/Card.js';

export default class SectionDelete extends ServiceBase {
    static validationRules = {
      id: [ 'required', 'uuid' ]
    };

    async execute ({ id }) {
      const section = await Section.findById(id);
      if (!section) throw new ServiceError('NOT_FOUND', { id });

      const cards = await Card.findAll({ where: { sectionId: id }, include: [ 'Fighter' ] });
      if (cards.length) {
        throw new ServiceError(
          'RELATED_INSTANCES',
          { cards: cards.map(c => `${c.Fighter.lastName} ${c.Fighter.name}`) }
        );
      }

      await section.destroy();

      return {
        data: dumpSection(section)
      };
    }
}
