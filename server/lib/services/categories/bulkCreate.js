import ServiceBase from '../Base.js';
import { dumpCategory } from '../../utils';

import Category from '../../models/Category.js';
import Competition from '../../models/Competition.js';
import Section from '../../models/Section.js';
import ServiceError from '../service-error.js';

export default class BulkCategoriesCreate extends ServiceBase {
  async validate(payload) {
    // let sectionType = payload.type;

    const groupValidationRule = ['required', { one_of: ['A', 'B'] }];
    const dataRules = {
      weightFrom: ['required', 'positive_decimal'],
      weightTo: ['required', 'positive_decimal'],
      sex: ['required', { one_of: ['man', 'woman'] }],
      ageFrom: ['required', 'positive_decimal'],
      ageTo: ['required', 'positive_decimal'],
    };

    if (payload.sectionId) {
      const sectionType = (await Section.findById(payload.sectionId)).type;
      if (sectionType === 'full') dataRules.group = groupValidationRule;
    }

    const validationRules = {
      competitionId: [{ required_if_not_present: 'sectionId' }, 'uuid'],
      section: [{ required_if_not_present: 'sectionId' }, { min_length: 2 }, { max_length: 500 }],
      type: [{ required_if_not_present: 'sectionId' }, { one_of: ['full', 'light'] }],
      sectionId: [{ required_if_not_present: 'section' }, 'uuid'],
      data: [
        'required',
        'not_empty_list',
        {
          list_of_objects: [dataRules],
        },
      ],
    };
    return this.doValidation(payload, validationRules);
  }

  async execute({ competitionId, data, ...payload }) {
    if (competitionId) {
      const competition = await Competition.findById(competitionId);
      if (!competition) throw new ServiceError('NOT_FOUND', { id: competitionId });
    }

    const section = payload.sectionId
      ? await Section.findById(payload.sectionId, { include: ['Categories'] })
      : await Section.create({
          name: payload.section,
          type: payload.type,
          competitionId,
        });

    if (!section) throw new ServiceError('NOT_FOUND', { id: payload.sectionId });

    const errors = Category.validateCategories([...(section.Categories || []), ...data], data);

    if (errors.length) throw new ServiceError('CATEGORIES_VALIDATION', errors);

    const commonData = {
      sectionId: section.id,
      competitionId: competitionId || section.competitionId,
      type: payload.type,
    };

    const prepared =
      commonData.type === 'full'
        ? ['A', 'B'].flatMap((group) => prepareCategories(commonData, data, group))
        : prepareCategories(commonData, data);

    const categories = await Category.bulkCreate(prepared, { validate: true });

    return {
      data: categories.map(dumpCategory),
    };
  }
}

const prepareCategories = (commonData, data, group = null) => {
  const maxWeight = Math.max(...data.map((c) => c.weightTo));

  return data.map((c) => ({
    competitionId: commonData.competitionId,
    sectionId: commonData.sectionId,
    type: commonData.type,
    weightName: (maxWeight === c.weightTo ? '+' : '-') + c.weightTo,
    group,
    ...c,
  }));
};
