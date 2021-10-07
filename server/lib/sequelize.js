import sequelize from './sequelizeSingleton.js';

import './models/Category.js';
import './models/Club.js';
import './models/Coach.js';
import './models/Fighter.js';
import './models/Card.js';
import './models/Cross.js';

for (const modelName in sequelize.models) {
  const model = sequelize.models[modelName];

  if (model.initRelation) {
    model.initRelation(sequelize);
  }
}

const { database, host, port, dialect } = sequelize.config;

export * from './sequelizeSingleton.js';

export const dbUrl = `${dialect}://${host}:${port}/${(database)}`;

export default sequelize;

export async function onShutdown () {
  await sequelize.close();
}
