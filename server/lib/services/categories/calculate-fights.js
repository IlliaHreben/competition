// import { Op }           from '../../sequelize.js';
import ServiceBase from '../Base.js';
import { dumpFight } from '../../utils';

import Category from '../../models/Category.js';

export default class CalculateCategoryFights extends ServiceBase {
  static validationRules = {
    categoryId: ['required', 'uuid'],
  };

  // 98972d62-373d-4229-a1a7-df7cde04b78f
  async execute({ categoryId }) {
    const category = await Category.findById(categoryId);
    const fights = await category.calculateFights();

    return {
      data: fights.map(dumpFight),
      // meta : {
      //   totalCount,
      //   filteredCount,
      //   limit,
      //   offset
      // }
    };
  }
}
