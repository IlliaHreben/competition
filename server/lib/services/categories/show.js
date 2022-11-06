import ServiceBase from '../Base.js';
import { dumpCategory } from '../../utils';

import Category from '../../models/Category.js';
export default class ShowCategory extends ServiceBase {
  static validationRules = {
    id: ['required', 'uuid'],
    include: ['to_array', { list_of: { one_of: ['cards', 'sections'] } }],
  };

  async execute({ id, include = [] }) {
    const category = await Category.scope(...include).findById(id);

    return {
      data: dumpCategory(category),
    };
  }
}
