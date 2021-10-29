import chista       from '../chista.js';

import Create       from '../services/competitions/create';
import List         from '../services/competitions/list';
import Show         from '../services/competitions/show';

export default {
  create : chista.makeServiceRunner(Create, req => ({ ...req.body })),
  show   : chista.makeServiceRunner(Show, req => ({ ...req.params, ...req.query })),
  list   : chista.makeServiceRunner(List, req => ({ ...req.query }))
};
