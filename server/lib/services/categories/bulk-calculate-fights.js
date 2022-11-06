// import { Op }           from '../../sequelize.js';
import ServiceBase from '../Base.js';
import { dumpCategory } from '../../utils';

import Category from '../../models/Category.js';

export default class BulkCalculateCategoryFights extends ServiceBase {
  static validationRules = {
    competitionId: ['required', 'uuid'],
  };

  // 98972d62-373d-4229-a1a7-df7cde04b78f
  async execute({ competitionId }) {
    const categories = await Category.findAll({ where: { competitionId } });
    const categoriesWithFights = await Promise.all(
      categories.map(async (c) => {
        c.fights = await c.calculateFights();
        return c;
      })
    );

    return {
      data: categoriesWithFights.map(dumpCategory),
      // meta : {
      //   totalCount,
      //   filteredCount,
      //   limit,
      //   offset
      // }
    };
  }
}
