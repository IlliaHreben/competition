import chista from '../chista.js';

import Create from '../services/clubs/create';
import list   from '../services/clubs/list';

export default {
  create : chista.makeServiceRunner(Create, req => ({ ...req.body })),
  list   : chista.makeServiceRunner(list, req => ({ ...req.query }))
};
