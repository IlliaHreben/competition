import ServiceBase       from '../Base.js';
import { dumpCategory }  from '../../utils';

import Category          from '../../models/Category.js';
import Competition       from '../../models/Competition.js';
import ServiceError      from '../service-error.js';

export default class CategoriesCreate extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      sectionId     : [ 'required', 'uuid' ],
      data          : [ 'required', {
        nested_object: {
          weightFrom : [ 'required', 'positive_decimal' ],
          weightTo   : [ 'required', 'positive_decimal' ],
          sex        : [ 'required', { one_of: [ 'man', 'woman' ] } ],
          ageFrom    : [ 'required', 'positive_decimal' ],
          ageTo      : [ 'required', 'positive_decimal' ]
        }
      } ]
    };

    async execute ({ competitionId, sectionId, data }) {
      const competition = await Competition.findById(competitionId);
      if (!competition) throw new ServiceError('NOT_FOUND', { id: competitionId });

      const categoriesToCheck = await Category.findAll({
        where: {
          competitionId,
          sectionId,
          sex     : data.sex,
          ageFrom : data.ageFrom,
          ageTo   : data.ageTo
        }
      });

      const errors = Category.validateCategories(categoriesToCheck, [ data ]);
      if (errors.length) throw new ServiceError('CATEGORY_VALIDATION', errors);

      const category = await Category.create(data);

      return {
        data: dumpCategory(category)
      };
    }
}
