import sequelize, { DT } from '../sequelize-singleton.js';
import Base              from './Base.js';

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
  id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

  name        : { type: DT.STRING, allowNull: false },
  description : { type: DT.STRING, allowNull: false },
  startDate   : { type: DT.DATE, allowNull: false },
  endDate     : { type: DT.DATE, allowNull: false },
  days        : {
    type: DT.VIRTUAL,
    get () {
      const first = new Date(this.startDate);
      const second = new Date(this.endDate);
      return Math.round((second - first) / (1000 * 60 * 60 * 24)) + 1;
    },
    set () {
      throw new Error('Do not try to set the `days` value!');
    }
  },

  createdAt : { type: DT.DATE, allowNull: false },
  deletedAt : { type: DT.DATE, allowNull: true },
  updatedAt : { type: DT.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
