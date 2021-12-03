import chista from '../chista.js';

import list   from '../services/settlements/list';
// import show    from '../services/settlements/show';
// import deleteS from '../services/settlements/delete';

export default {
  // show   : chista.makeServiceRunner(show, req => ({ id: req.params.id, ...req.query })),
  list: chista.makeServiceRunner(list, req => ({ ...req.query }))
  // delete : chista.makeServiceRunner(deleteS, req => ({ ...req.body }))
};
