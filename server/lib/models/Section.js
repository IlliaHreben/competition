import sequelize, { DT } from '../sequelize-singleton.js';
import Base              from './Base.js';

export default class Section extends Base {
  static initRelation () {
    const Card = sequelize.model('Card');
    const Category = sequelize.model('Category');
    const Competition = sequelize.model('Competition');

    this.belongsTo(Competition, {
      as         : 'Competition',
      foreignKey : {
        name      : 'competitionId',
        allowNull : false
      }
    });

    this.hasMany(Card, {
      as         : 'Cards',
      foreignKey : {
        name      : 'sectionId',
        allowNull : true
      }
    });

    this.hasMany(Category, {
      as         : 'Categories',
      foreignKey : {
        name      : 'sectionId',
        allowNull : false
      }
    });
  }

  static initScopes () {
    const scopes = {
      categories: {
        include: [ 'Categories' ]
      }
    };

    Object.entries(scopes).forEach(scope => this.addScope(...scope));
  }
}

Section.init({
  id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

  name : { type: DT.STRING, allowNull: false },
  type : { type: DT.ENUM([ 'full', 'light' ]), allowNull: false },

  competitionId: { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Competitions', key: 'id' }, allowNull: false },

  createdAt : { type: DT.DATE, allowNull: false, defaultValue: new Date() },
  deletedAt : { type: DT.DATE, allowNull: true },
  updatedAt : { type: DT.DATE, allowNull: false, defaultValue: new Date() }
}, {
  sequelize,
  paranoid: true
});
