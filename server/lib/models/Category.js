import Sequelize         from 'sequelize';
import sequelize         from '../sequelizeSingleton.js';
import Base              from './Base.js';

export default class Category extends Base {
  static initRelation () {
    const Fighter = sequelize.model('Fighter');

    this.hasMany(Fighter, {
      as         : 'Fighters',
      foreignKey : {
        name      : 'categoryId',
        allowNull : true
      }
    });
  }
}

Category.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  name       : { type: Sequelize.STRING, allowNull: false },
  sex        : { type: Sequelize.ENUM([ 'men', 'women' ]), allowNull: false },
  type       : { type: Sequelize.ENUM([ 'full', 'light' ]), allowNull: false },
  age        : { type: Sequelize.INTEGER, allowNull: false },
  weightFrom : { type: Sequelize.FLOAT, allowNull: false },
  weightTo   : { type: Sequelize.FLOAT, allowNull: false },
  weightName : { type: Sequelize.STRING, allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  deletedAt : { type: Sequelize.DATE, allowNull: true },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
