import chista from '../chista.js';

import list   from '../services/coaches/list';

export default {
  list: chista.makeServiceRunner(list, req => ({ ...req.query }))
};
