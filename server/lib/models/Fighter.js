import Sequelize         from 'sequelize';
import sequelize         from '../sequelizeSingleton';
import Base from './Base';

import Club from './Club';
import Coach from './Coach';

export default class Fighter extends Base {
  static initRelation () {
    this.belongsTo(Club, {
      as         : 'Club',
      foreignKey : {
        name      : 'clubId',
        allowNull : false
      }
    });

    this.belongsTo(Coach, {
      as         : 'Coach',
      foreignKey : {
        name      : 'coachId',
        allowNull : false
      }
    });
  }
}

Fighter.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  name      : { type: Sequelize.STRING, allowNull: false },
  lastName  : { type: Sequelize.STRING, allowNull: false },
  sex       : { type: Sequelize.ENUM([ 'man', 'woman' ]), allowNull: false },
  city      : { type: Sequelize.STRING, allowNull: false },
  clubId    : { type: Sequelize.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Clubs', key: 'id' }, allowNull: false },
  coachId   : { type: Sequelize.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Coaches', key: 'id' }, allowNull: false },
  birthDate : { type: Sequelize.DATE, allowNull: false },
  group     : { type: Sequelize.ENUM([ 'A', 'B' ]), allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  deletedAt : { type: Sequelize.DATE, allowNull: true },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
