import ServiceBase       from '../Base.js';
import { dumpCategory }  from '../../utils';

import Category          from '../../models/Category.js';
import Competition       from '../../models/Competition.js';
import { sections }      from '../../constants/categories.js';
import { ServiceError }  from '../service-error.js';

export default class BulkCategoriesDelete extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      data          : [ 'required', {
        list_of_objects: [ 'required', {
          type       : [ 'required', { one_of: [ 'ring', 'tatami' ] } ],
          weightFrom : [ 'required', 'positive_integer' ],
          weightTo   : [ 'required', 'positive_integer' ],
          sex        : [ 'required', { one_of: [ 'man', 'woman' ] } ],
          ageFrom    : [ 'required', 'positive_integer' ],
          ageTo      : [ 'required', 'positive_integer' ],
          section    : [ 'required', { one_of: sections } ]
        } ]
      } ]
    };

    async execute ({ competitionId, data }) {
      const competition = await Competition.findById(competitionId);
      if (!competition) throw new ServiceError('NOT_FOUND', { id: competitionId });

      const categories = await Category.bulkCreate(data.map(c => ({ competitionId, ...c })));

      return {
        data: categories.map(dumpCategory)
      };
    }
}
