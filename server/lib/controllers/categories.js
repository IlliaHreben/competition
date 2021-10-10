import chista from '../chista.js';

import list   from '../services/categories/list';

export default {
  list: chista.makeServiceRunner(list, req => req.query)
};
