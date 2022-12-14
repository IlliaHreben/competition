import config from '../etc/db.cjs';
import cls from 'cls-hooked';
import { Sequelize, DataTypes } from 'sequelize';
export { Op } from 'sequelize';
export const DT = DataTypes;

const namespace = cls.createNamespace('sequelize-transactions');

Sequelize.useCLS(namespace);
const { database, username, password, ...options } = config;
const sequelize = new Sequelize(database, username, password, options);

export const isolationLevels = {
  uncommited: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
  commited: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  repitable: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  serializable: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
};

export default sequelize;
