import Sequelize         from 'sequelize';
import sequelize         from '../sequelizeSingleton.js';
import Base from './Base.js';

import Club from './Club.js';
import Coach from './Coach.js';
import Fighter from './Fighter.js';
import Category from './Category.js';

export default class Card extends Base {
  static initRelation () {
    this.belongsTo(Club, {
      as         : 'Club',
      foreignKey : {
        name      : 'clubId',
        allowNull : false
      }
    });
    this.belongsTo(Club, {
      as         : 'Club',
      foreignKey : {
        name      : 'secondaryClubId',
        allowNull : true
      }
    });
    this.belongsTo(Coach, {
      as         : 'Coach',
      foreignKey : {
        name      : 'coachId',
        allowNull : false
      }
    });
    this.belongsTo(Fighter, {
      as         : 'Coach',
      foreignKey : {
        name      : 'fighterId',
        allowNull : false
      }
    });
    this.belongsTo(Category, {
      as         : 'Coach',
      foreignKey : {
        name      : 'fighterId',
        allowNull : false
      }
    });
  }
}

Card.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  fighterId       : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Fighters', key: 'id' }, allowNull: false },
  clubId          : { type: Sequelize.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Clubs', key: 'id' }, allowNull: false },
  secondaryClubId : { type: Sequelize.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Clubs', key: 'id' }, allowNull: true },
  coachId         : { type: Sequelize.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Coaches', key: 'id' }, allowNull: false },
  categoryId      : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Fighters', key: 'id' }, allowNull: false },

  weight     : { type: Sequelize.FLOAT, allowNull: false },
  realWeight : { type: Sequelize.FLOAT, allowNull: false },
  group      : { type: Sequelize.ENUM([ 'A', 'B' ]), allowNull: true },
  city       : { type: Sequelize.STRING, allowNull: false },
  birthDate  : { type: Sequelize.DATE, allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  deletedAt : { type: Sequelize.DATE, allowNull: true },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
