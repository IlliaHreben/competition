import chista       from '../chista.js';

import Create       from '../services/competitions/create';
import List         from '../services/competitions/list';

export default {
  create : chista.makeServiceRunner(Create, req => ({ ...req.body })),
  list   : chista.makeServiceRunner(List, req => ({ ...req.query }))
};
