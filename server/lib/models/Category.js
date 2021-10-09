import Sequelize         from 'sequelize';
import sequelize         from '../sequelize-singleton.js';
import Base              from './Base.js';

export default class Category extends Base {
  static initRelation () {
    const Card = sequelize.model('Card');

    this.hasMany(Card, {
      as         : 'Cards',
      foreignKey : {
        name      : 'categoryId',
        allowNull : true
      }
    });
  }
}

Category.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  section    : { type: Sequelize.STRING, allowNull: false },
  sex        : { type: Sequelize.ENUM([ 'man', 'woman' ]), allowNull: false },
  type       : { type: Sequelize.ENUM([ 'full', 'light' ]), allowNull: false },
  ageFrom    : { type: Sequelize.INTEGER, allowNull: false },
  ageTo      : { type: Sequelize.INTEGER, allowNull: false },
  weightFrom : { type: Sequelize.FLOAT, allowNull: false },
  weightTo   : { type: Sequelize.FLOAT, allowNull: false },
  weightName : { type: Sequelize.STRING, allowNull: false },
  group      : { type: Sequelize.ENUM([ 'A', 'B' ]), allowNull: true },

  competitionId: { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Competitions', key: 'id' }, allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  deletedAt : { type: Sequelize.DATE, allowNull: true },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
