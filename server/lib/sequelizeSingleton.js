import Sequelize from 'sequelize';
import config    from '../etc/db.js';

export const Op = Sequelize.Op;

const { database, username, password, ...options } = config;
const sequelize = new Sequelize(database, username, password, options);

export const isolationLevels = {
  uncommited   : Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
  commited     : Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  repitable    : Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  serializable : Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
};

export default sequelize;
