import chista from '../chista.js';

import list from '../services/categories/list';
import show from '../services/categories/show';
import calculateFights from '../services/categories/calculate-fights';
import bulkCalculateFights from '../services/categories/bulk-calculate-fights';
import bulkCreate from '../services/categories/bulkCreate';
import bulkDelete from '../services/categories/bulkDelete';

export default {
  show: chista.makeServiceRunner(show, (req) => ({
    id: req.params.id,
    ...req.query,
  })),
  list: chista.makeServiceRunner(list, (req) => ({ ...req.query })),
  calculateFights: chista.makeServiceRunner(calculateFights, (req) => ({
    ...req.query,
  })),
  bulkCalculateFights: chista.makeServiceRunner(bulkCalculateFights, (req) => ({
    ...req.query,
  })),
  bulkCreate: chista.makeServiceRunner(bulkCreate, (req) => ({ ...req.body })),
  bulkDelete: chista.makeServiceRunner(bulkDelete, (req) => ({ ...req.body })),
};
