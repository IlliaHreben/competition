import chista         from '../chista.js';

import Create         from '../services/competitions/create';
import List           from '../services/competitions/list';
import Show           from '../services/competitions/show';
import Update         from '../services/competitions/update';

export default {
  create : chista.makeServiceRunner(Create, req => ({ ...req.body })),
  show   : chista.makeServiceRunner(Show, req => ({ ...req.params, ...req.query })),
  update : chista.makeServiceRunner(Update, req => ({ ...req.params, ...req.body })),
  list   : chista.makeServiceRunner(List, req => ({ ...req.query }))
};
