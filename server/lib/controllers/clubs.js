import chista from '../chista.js';

import Create from '../services/clubs/create';
import list   from '../services/clubs/list';
import Update from '../services/clubs/update';
import Show   from '../services/clubs/show';

export default {
  create : chista.makeServiceRunner(Create, req => ({ ...req.body })),
  list   : chista.makeServiceRunner(list, req => ({ ...req.query })),
  update : chista.makeServiceRunner(Update, req => ({ ...req.params, ...req.body })),
  show   : chista.makeServiceRunner(Show, req => ({ ...req.params, ...req.query }))
};
