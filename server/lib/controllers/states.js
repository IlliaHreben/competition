import chista from '../chista.js';

import list from '../services/states/list';
import create from '../services/states/create';
// import show    from '../services/states/show';
// import deleteS from '../services/states/delete';

export default {
  // show   : chista.makeServiceRunner(show, req => ({ id: req.params.id, ...req.query })),
  list: chista.makeServiceRunner(list, (req) => ({ ...req.query })),
  create: chista.makeServiceRunner(create, (req) => ({ ...req.body })),
  // delete : chista.makeServiceRunner(deleteS, req => ({ ...req.body }))
};
