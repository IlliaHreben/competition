import chista from '../chista.js';

import Create from '../services/coaches/create';
import list from '../services/coaches/list';
import Update from '../services/coaches/update';
import Show from '../services/coaches/show';

export default {
  create: chista.makeServiceRunner(Create, (req) => ({ ...req.body })),
  list: chista.makeServiceRunner(list, (req) => ({ ...req.query })),
  update: chista.makeServiceRunner(Update, (req) => ({
    ...req.params,
    ...req.body,
  })),
  show: chista.makeServiceRunner(Show, (req) => ({
    ...req.params,
    ...req.query,
  })),
};
