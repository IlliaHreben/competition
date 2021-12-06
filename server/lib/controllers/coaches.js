import chista from '../chista.js';

import Create from '../services/coaches/create';
import list   from '../services/coaches/list';

export default {
  create : chista.makeServiceRunner(Create, req => ({ ...req.body })),
  list   : chista.makeServiceRunner(list, req => ({ ...req.query }))
};
