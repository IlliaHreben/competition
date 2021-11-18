import ServiceBase       from '../Base.js';
import { dumpCategory }  from '../../utils';

import Category          from '../../models/Category.js';
import Competition       from '../../models/Competition.js';
import Section           from '../../models/Section.js';
import ServiceError      from '../service-error.js';

export default class BulkCategoriesCreate extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      section       : [ 'required', { min_length: 2 }, { max_length: 500 } ],
      type          : [ 'required', { one_of: [ 'full', 'light' ] } ],
      data          : [ 'required', 'not_empty_list', {
        list_of_objects: [ {
          weightFrom : [ 'required', 'positive_decimal' ],
          weightTo   : [ 'required', 'positive_decimal' ],
          sex        : [ 'required', { one_of: [ 'man', 'woman' ] } ],
          ageFrom    : [ 'required', 'positive_decimal' ],
          ageTo      : [ 'required', 'positive_decimal' ]
        } ]
      } ]
    };

    async execute ({ competitionId, data, ...payload }) {
      const competition = await Competition.findById(competitionId);
      if (!competition) throw new ServiceError('NOT_FOUND', { id: competitionId });

      const errors = Category.validateCategories(data);
      if (errors.length) throw new ServiceError('CATEGORIES_VALIDATION', errors);

      const section = await Section.create({ name: payload.section, competitionId });

      const commonData = {
        sectionId : section.id,
        competitionId,
        type      : payload.type
      };

      const prepared = commonData.type === 'full'
        ? [ 'A', 'B' ].flatMap(group => prepareCategories(commonData, data, group))
        : prepareCategories(commonData, data);

      const categories = await Category.bulkCreate(prepared, { returning: true, validate: true });

      return {
        data: categories.map(dumpCategory)
      };
    }
}

const prepareCategories = (commonData, data, group = null) => {
  const maxWeight = Math.max(...data.map(c => c.weightTo));

  return data.map(c => ({
    competitionId : commonData.competitionId,
    sectionId     : commonData.sectionId,
    type          : commonData.type,
    weightName    : (maxWeight === c.weightTo ? '+' : '-') + c.weightTo,
    group,
    ...c
  }));
};
