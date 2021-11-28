import chista     from '../chista.js';

import bulkCreate from '../services/cards/bulk-create.js';
import list       from '../services/cards/list';
import deleteCard from '../services/cards/delete';

export default {
  bulkCreate : chista.makeServiceRunner(bulkCreate, req => ({ ...req.query, ...req.body })),
  list       : chista.makeServiceRunner(list, req => ({ ...req.query })),
  delete     : chista.makeServiceRunner(deleteCard, req => ({ ...req.body }))
};
