import ServiceBase       from '../Base.js';
import { dumpCategory }  from '../../utils';

import Category          from '../../models/Category.js';
import Competition       from '../../models/Competition.js';
import { ServiceError }  from '../service-error.js';

export default class BulkCategoriesCreate extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      section       : [ 'required', { min_length: 2 }, { max_length: 500 } ],
      type          : [ 'required', { one_of: [ 'full', 'light' ] } ],
      data          : [ 'required', {
        list_of_objects: [ {
          weightFrom : [ 'required', 'positive_integer' ],
          weightTo   : [ 'required', 'positive_integer' ],
          sex        : [ 'required', { one_of: [ 'man', 'woman' ] } ],
          ageFrom    : [ 'required', 'positive_integer' ],
          ageTo      : [ 'required', 'positive_integer' ]
        } ]
      } ]
    };

    async execute ({ competitionId, data, ...commonData }) {
      const competition = await Competition.findById(competitionId);
      if (!competition) throw new ServiceError('NOT_FOUND', { id: competitionId });

      const prepared = commonData.type === 'full'
        ? [ 'A', 'B' ].flatMap(group => prepareCategories(competitionId, data, commonData, group))
        : prepareCategories(competitionId, data, commonData);

      const categories = await Category.bulkCreate(prepared, { returning: true, validate: true });

      return {
        data: categories.map(dumpCategory)
      };
    }
}

const prepareCategories = (competitionId, data, commonData, group = null) => {
  const maxWeight = Math.max(...data.map(c => c.weightTo));

  return data.map(c => ({
    competitionId,
    section    : commonData.section,
    type       : commonData.type,
    weightName : (maxWeight === c.weightTo ? '+' : '-') + c.weightTo,
    group,
    ...c
  }));
};
