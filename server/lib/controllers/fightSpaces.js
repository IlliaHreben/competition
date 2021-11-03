import chista                from '../chista.js';

import list                  from '../services/fightSpaces/list';
// import show                  from '../services/fightSpaces/show';
// import calculateFights       from '../services/fightSpaces/calculate-fights';
// import bulkCalculateFights   from '../services/fightSpaces/bulk-calculate-fights';
import bulkUpdate            from '../services/fightSpaces/bulkUpdate';
// import bulkDelete            from '../services/fightSpaces/bulkDelete';

export default {
  // show                : chista.makeServiceRunner(show, req => ({ id: req.params.id, ...req.query })),
  list       : chista.makeServiceRunner(list, req => ({ ...req.query })),
  bulkUpdate : chista.makeServiceRunner(bulkUpdate, req => ({ ...req.body }))

  // calculateFights     : chista.makeServiceRunner(calculateFights, req => req.query),
  // bulkCalculateFights : chista.makeServiceRunner(bulkCalculateFights, req => req.query),
  // bulkCreate          : chista.makeServiceRunner(bulkCreate, req => ({ ...req.query })),
  // bulkDelete          : chista.makeServiceRunner(bulkDelete, req => ({ ...req.query }))
};
