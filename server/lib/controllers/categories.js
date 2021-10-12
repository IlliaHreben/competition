import chista            from '../chista.js';

import list              from '../services/categories/list';
import calculateFights   from '../services/categories/calculate-fights';

export default {
  list            : chista.makeServiceRunner(list, req => req.query),
  calculateFights : chista.makeServiceRunner(calculateFights, req => req.query)
};
