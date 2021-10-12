import chista       from '../chista.js';

import bulkCreate   from '../services/cards/bulk-create.js';

export default {
  bulkCreate: chista.makeServiceRunner(bulkCreate, req => ({ ...req.query, ...req.body }))
};
