import Sequelize from 'sequelize';
import config    from '../etc/db.cjs';
import cls       from 'cls-hooked';

const namespace = cls.createNamespace('sequelize-transactions');

export const Op = Sequelize.Op;
export const DT = Sequelize.DataTypes;

Sequelize.useCLS(namespace);
const { database, username, password, ...options } = config;
const sequelize = new Sequelize(database, username, password, options);

export const isolationLevels = {
  uncommited   : Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
  commited     : Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  repitable    : Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  serializable : Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
};

export default sequelize;
