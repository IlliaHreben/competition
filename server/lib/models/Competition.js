import sequelize, { DT } from '../sequelize-singleton.js';
import Base              from './Base.js';

import defaultCategories from '../constants/categories.json';
import ServiceError      from '../services/service-error';

export default class Competition extends Base {
  static initRelation () {
    const Category = sequelize.model('Category');
    const Card = sequelize.model('Card');
    const FightSpace = sequelize.model('FightSpace');
    const Section = sequelize.model('Section');

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

    this.hasMany(Section, {
      as         : 'Sections',
      foreignKey : {
        name      : 'competitionId',
        allowNull : false
      }
    });
  }

  static async createCompetition ({ ringsCount, tatamisCount, ...data }) {
    const FightSpace = sequelize.model('FightSpace');
    const Category = sequelize.model('Category');
    const Section = sequelize.model('Section');

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

    const sectionsNames = [ ...new Set(defaultCategories.map(c => c.section)) ];

    const sections = await Section.bulkCreate(sectionsNames.map(name => ({
      name,
      type          : defaultCategories.find(c => c.section === name).type,
      competitionId : this.id
    })));

    const categoriesPromise =  Category.bulkCreate(
      defaultCategories.map(({ type, section, ...category }) => ({
        ...category,
        sectionId     : sections.find(s => s.name === section).id,
        competitionId : competition.id
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

  async complete () {
    const Fight = sequelize.model('Fight');

    const categories = await this.getCategories({
      include: { model: Fight, as: 'Fights', required: true }
    });

    const fights = categories.flatMap(c => c.Fights);

    const hasAtLeastOneWinner = fights.some(fight => fight.winnerId);
    const hasUncompletedFights = fights.some(fight => !fight.winnerId);

    if (!hasAtLeastOneWinner && hasUncompletedFights) throw new ServiceError('HAS_UNCOMPLETED_FIGHTS');

    return this.update({ completed: true, active: false });
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
  active    : { type: DT.BOOLEAN, allowNull: false, defaultValue: false },
  completed : { type: DT.BOOLEAN, allowNull: false, defaultValue: false },

  createdAt : { type: DT.DATE, allowNull: false },
  deletedAt : { type: DT.DATE, allowNull: true },
  updatedAt : { type: DT.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true,

  scopes: {}
});
