import sequelize, { DT }     from '../sequelize-singleton.js';
import Base                  from './Base.js';

export default class Category extends Base {
  static initRelation () {
    console.log('='.repeat(50)); // !nocommit
    console.log();
    console.log('='.repeat(50));
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
  id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

  section    : { type: DT.STRING, allowNull: false },
  sex        : { type: DT.ENUM([ 'man', 'woman' ]), allowNull: false },
  type       : { type: DT.ENUM([ 'full', 'light' ]), allowNull: false },
  ageFrom    : { type: DT.INTEGER, allowNull: false },
  ageTo      : { type: DT.INTEGER, allowNull: false },
  weightFrom : { type: DT.FLOAT, allowNull: false },
  weightTo   : { type: DT.FLOAT, allowNull: false },
  weightName : { type: DT.STRING, allowNull: false },
  group      : { type: DT.ENUM([ 'A', 'B' ]), allowNull: true },

  competitionId: { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Competitions', key: 'id' }, allowNull: false },

  createdAt : { type: DT.DATE, allowNull: false },
  deletedAt : { type: DT.DATE, allowNull: true },
  updatedAt : { type: DT.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
