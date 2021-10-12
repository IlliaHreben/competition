import sequelize, { DT }    from '../sequelize-singleton.js';
import Base                 from './Base.js';

import Card                 from './Card.js';
import Category             from './Category.js';

export default class Fight extends Base {
  static initRelation () {
    this.belongsTo(Card, {
      as         : 'FirstCard',
      foreignKey : {
        name      : 'firstCardId',
        allowNull : true
      }
    });

    this.belongsTo(Card, {
      as         : 'SecondCard',
      foreignKey : {
        name      : 'secondCardId',
        allowNull : true
      }
    });

    this.belongsTo(Card, {
      as         : 'Winner',
      foreignKey : {
        name      : 'winnerId',
        allowNull : true
      }
    });

    this.belongsTo(Fight, {
      as         : 'NextFight',
      foreignKey : {
        name      : 'nextFightId',
        allowNull : true
      }
    });

    this.hasMany(Fight, {
      as         : 'PreviousFights',
      foreignKey : {
        name      : 'nextFightId',
        allowNull : true
      }
    });

    this.belongsTo(Category, {
      as         : 'Category',
      foreignKey : {
        name      : 'categoryId',
        allowNull : false
      }
    });

    // this.belongsTo(FightSpace, {
    //   as         : 'Category',
    //   foreignKey : {
    //     name      : 'fightSpaceId',
    //     allowNull : false
    //   }
    // });
  }
}

Fight.init({
  id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

  degree      : { type: DT.INTEGER, allowNull: false },
  orderNumber : { type: DT.INTEGER, allowNull: false },

  firstCardId  : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Cards', key: 'id' }, allowNull: true },
  secondCardId : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Cards', key: 'id' }, allowNull: true },
  winnerId     : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Cards', key: 'id' }, allowNull: true },
  nextFightId  : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Fights', key: 'id' }, allowNull: true },
  categoryId   : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Categories', key: 'id' }, allowNull: false },
  fightSpaceId : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'FightSpaces', key: 'id' }, allowNull: true },

  executedAt : { type: DT.DATE, allowNull: true },
  createdAt  : { type: DT.DATE, allowNull: false },
  updatedAt  : { type: DT.DATE, allowNull: false }
}, {
  sequelize
});
