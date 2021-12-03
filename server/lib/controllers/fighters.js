import chista from '../chista.js';

// import bulkCreate from '../services/fighters/bulk-create.js';
// import list       from '../services/fighters/list';
// import deleteFighter from '../services/fighters/delete';
// import Show       from '../services/fighters/show';
import Update from '../services/fighters/update';

export default {
  // bulkCreate : chista.makeServiceRunner(bulkCreate, req => ({ ...req.query, ...req.body })),
  // list       : chista.makeServiceRunner(list, req => ({ ...req.query })),
  // delete     : chista.makeServiceRunner(deleteFighter, req => ({ ...req.body })),
  // show       : chista.makeServiceRunner(Show, req => ({ ...req.params, ...req.query })),
  update: chista.makeServiceRunner(Update, req => ({ ...req.body, ...req.params }))
};
