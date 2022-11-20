import chista from '../chista.js';

import Create from '../services/fight-formulas/create';
import List from '../services/fight-formulas/list';
import Show from '../services/fight-formulas/show';
import Update from '../services/fight-formulas/update';
import Delete from '../services/fight-formulas/delete';

export default {
  create: chista.makeServiceRunner(Create, (req) => ({ ...req.body })),
  show: chista.makeServiceRunner(Show, (req) => ({
    ...req.params,
    ...req.query,
  })),
  update: chista.makeServiceRunner(Update, (req) => ({
    ...req.params,
    ...req.body,
  })),
  list: chista.makeServiceRunner(List, (req) => ({ ...req.query })),
  delete: chista.makeServiceRunner(Delete, (req) => ({ ...req.body })),
};
