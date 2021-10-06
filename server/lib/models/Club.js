import Sequelize         from 'sequelize';
import sequelize         from '../sequelizeSingleton';
import Base from './Base';

import Coach from './Coach';

export default class Club extends Base {
  static initRelation () {
    this.belongsToMany(Coach, {
      as         : 'Coaches',
      through    : 'ClubsToCoaches',
      foreignKey : {
        name      : 'clubId',
        allowNull : false
      },
      onDelete : 'cascade',
      onUpdate : 'cascade'
    });
  }
}

Club.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  name: { type: Sequelize.STRING, allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  deletedAt : { type: Sequelize.DATE, allowNull: true },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
