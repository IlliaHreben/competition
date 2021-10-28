import sequelize, { DT } from '../sequelize-singleton.js';
import Base              from './Base.js';

import defaultCategories from '../constants/categories.json';

export default class Competition extends Base {
  static initRelation () {
    const Category = sequelize.model('Category');
    const Card = sequelize.model('Card');
    const FightSpace = sequelize.model('FightSpace');

    this.hasMany(Category, {
      as         : 'Categories',
      foreignKey : {
        name      : 'competitionId',
        allowNull : false
      }
    });
    this.hasMany(Card, {
      as         : 'Cards',
      foreignKey : {
        name      : 'competitionId',
        allowNull : false
      }
    });
    this.hasMany(FightSpace, {
      as         : 'FightSpaces',
      foreignKey : {
        name      : 'competitionId',
        allowNull : false
      }
    });
  }

  static async createCompetition ({ ringsCount, tatamisCount, ...data }) {
    const FightSpace = sequelize.model('FightSpace');
    const Category = sequelize.model('Category');

    const competition = await this.create(data);

    const fightSpacesPromise = await FightSpace.bulkCreate(
      [
        ...Array.from({ length: ringsCount }).flatMap(
          () => Array.from({ length: competition.days }).map((_, i) => ({ type: 'ring', competitionDay: i + 1 }))
        ),
        ...Array.from({ length: tatamisCount }).flatMap(
          () => Array.from({ length: competition.days }).map((_, i) => ({ type: 'tatami', competitionDay: i + 1 }))
        )
      ].map(({ type, competitionDay }, i) => ({
        type,
        orderNumber   : i + 1,
        competitionDay,
        competitionId : competition.id
      })),
      { returning: true }
    );

    const categoriesPromise =  Category.bulkCreate(
      defaultCategories.map(category => ({
        ...category,
        competitionId: competition.id
      }))
    );

    const [ fightSpaces, categories ] = await Promise.all([ fightSpacesPromise, categoriesPromise ]);

    competition.FightSpaces = fightSpaces;
    competition.Categories = categories;

    return competition;
  }
}

Competition.init({
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
