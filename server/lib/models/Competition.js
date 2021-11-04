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

    const generateSpaces = (count, type) => {
      return Array.from({ length: competition.days }).flatMap(
        (_, i) => Array.from({ length: count }).map((_, k) => ({ type, competitionDay: i + 1, orderNumber: k + 1 }))
      );
    };

    const fightSpacesPromise = await FightSpace.bulkCreate(
      [
        ...generateSpaces(ringsCount, 'ring'),
        ...generateSpaces(tatamisCount, 'tatami')
      ].map((space) => ({ ...space, competitionId: competition.id })),
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

  async recalculateFightSpaces (spaces) {
    const FightSpace = sequelize.model('FightSpace');
    const toBeAbandonedIds = spaces.filter(s => s.id).map(s => s.id);

    const currentSpaces = await this.getFightSpaces();
    const toBeAbandoned = currentSpaces.filter(s => toBeAbandonedIds.includes(s.id));

    const toBeDeletedIds = currentSpaces
      .filter(s => !toBeAbandonedIds.includes(s.id))
      .map(s => s.id);

    const toBeAdded = spaces.filter(s => !s.id).map(s => ({ competitionId: this.id, ...s }));

    const [ added ] = await Promise.all([
      FightSpace.bulkCreate(toBeAdded),
      FightSpace.destroy({ where: { id: toBeDeletedIds } })
    ]);

    return [ ...toBeAbandoned, ...added ];
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
  paranoid: true,

  scopes: {}
});
