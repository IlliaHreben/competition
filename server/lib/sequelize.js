import sequelize from './sequelize-singleton.js';

import './models/Competition.js';
import './models/State.js';
import './models/Settlement.js';
import './models/Section.js';
import './models/Category.js';
import './models/FightSpace.js';
import './models/Club.js';
import './models/Coach.js';
import './models/Fighter.js';
import './models/Card.js';
import './models/Cross.js';
import './models/Fight.js';

for (const Model of Object.values(sequelize.models)) {
  Model.initRelation?.(sequelize);
  Model.initScopes?.();
}

const { database, host, port, dialect } = sequelize.config;

export * from './sequelize-singleton.js';

export const dbUrl = `${dialect}://${host}:${port}/${(database)}`;

export default sequelize;

export async function onShutdown () {
  await sequelize.close();
}
