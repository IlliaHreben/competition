import chista     from '../chista.js';

import bulkCreate from '../services/cards/bulk-create.js';
import list       from '../services/cards/list';
import deleteCard from '../services/cards/delete';
import Show       from '../services/cards/show';
import Update     from '../services/cards/update';

export default {
  bulkCreate : chista.makeServiceRunner(bulkCreate, req => ({ ...req.query, ...req.body })),
  list       : chista.makeServiceRunner(list, req => ({ ...req.query })),
  delete     : chista.makeServiceRunner(deleteCard, req => ({ ...req.body })),
  show       : chista.makeServiceRunner(Show, req => ({ ...req.params, ...req.query })),
  update     : chista.makeServiceRunner(Update, req => ({ ...req.params, ...req.body }))
};
