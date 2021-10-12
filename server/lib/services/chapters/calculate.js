import { Op }           from '../../sequelize.js';

import Category         from '../../models/Category.js';

(async () => {
  const categories = await Category.findById('e160dd5f-0904-43ab-aba7-623da2a578cd', {
    include: [ 'Cards' ]
  });

  console.log('='.repeat(50)); // !nocommit
  console.log(categories);
  console.log('='.repeat(50));
})();
