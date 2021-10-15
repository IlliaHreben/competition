import chista            from '../chista.js';

import list              from '../services/categories/list';
import show              from '../services/categories/show';
import calculateFights   from '../services/categories/calculate-fights';

export default {
  show            : chista.makeServiceRunner(show, req => ({ id: req.params.id, ...req.query })),
  list            : chista.makeServiceRunner(list, req => req.query),
  calculateFights : chista.makeServiceRunner(calculateFights, req => req.query)
};
