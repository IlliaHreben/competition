import Sequelize from 'sequelize';
import sequelize from '../sequelize-singleton.js';
import Base      from './Base.js';

export default class Category extends Base {
  static initRelation () {
    const Category = sequelize.model('Category');
    const Card = sequelize.model('Card');

    this.hasMany(Category, {
      as         : 'Categories',
      foreignKey : {
        name      : 'competitionId',
        allowNull : false
      }
    });
    this.hasMany(Card, {
      as         : 'Card',
      foreignKey : {
        name      : 'competitionId',
        allowNull : false
      }
    });
  }
}

Category.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  name         : { type: Sequelize.STRING, allowNull: false },
  description  : { type: Sequelize.STRING, allowNull: false },
  startDate    : { type: Sequelize.DATE, allowNull: false },
  endDate      : { type: Sequelize.DATE, allowNull: false },
  days         : { type: Sequelize.INTEGER, allowNull: false },
  ringsCount   : { type: Sequelize.INTEGER, allowNull: false },
  tatamisCount : { type: Sequelize.INTEGER, allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  deletedAt : { type: Sequelize.DATE, allowNull: true },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
