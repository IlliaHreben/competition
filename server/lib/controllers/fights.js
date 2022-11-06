import chista from '../chista.js';

import setWinner from '../services/fights/setWinner';
// import Create     from '../services/fights/create';
// import list       from '../services/fights/list';
// import deleteCard from '../services/fights/delete';
// import Show       from '../services/fights/show';
// import Update     from '../services/fights/update';

export default {
  setWinner: chista.makeServiceRunner(setWinner, (req) => ({
    ...req.params,
    ...req.body,
  })),
  // create     : chista.makeServiceRunner(Create, req => ({ ...req.body })),
  // list       : chista.makeServiceRunner(list, req => ({ ...req.query })),
  // delete     : chista.makeServiceRunner(deleteCard, req => ({ ...req.body })),
  // show       : chista.makeServiceRunner(Show, req => ({ ...req.params, ...req.query })),
  // update     : chista.makeServiceRunner(Update, req => ({ ...req.params, ...req.body }))
};
