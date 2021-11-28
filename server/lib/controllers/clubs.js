import chista from '../chista.js';

import list   from '../services/clubs/list';

export default {
  list: chista.makeServiceRunner(list, req => ({ ...req.query }))
};
