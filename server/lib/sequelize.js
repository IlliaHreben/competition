import sequelize from './sequelizeSingleton.js';

import './models/User';
import './models/Action';

for (const modelName in sequelize.models) { // eslint-disable-line
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
