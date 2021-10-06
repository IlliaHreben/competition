import sequelize from './sequelizeSingleton.js';

import './models/Category';
import './models/Club';
import './models/Coach';
import './models/Fighter';
import './models/Card';
import './models/Cross';

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
