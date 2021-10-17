import sequelize, { Op, DT } from '../sequelize-singleton.js';

import Base                  from './Base.js';

export default class Card extends Base {
  static initRelation () {
    const Club = sequelize.model('Club');
    const Coach = sequelize.model('Coach');
    const Fighter = sequelize.model('Fighter');
    const Category = sequelize.model('Category');
    const Competition = sequelize.model('Competition');

    this.belongsTo(Club, {
      as         : 'Club',
      foreignKey : {
        name      : 'clubId',
        allowNull : false
      }
    });
    this.belongsTo(Club, {
      as         : 'SecondaryClub',
      foreignKey : {
        name      : 'secondaryClubId',
        allowNull : true
      }
    });
    this.belongsTo(Coach, {
      as         : 'Coach',
      foreignKey : {
        name      : 'coachId',
        allowNull : false
      }
    });
    this.belongsTo(Fighter, {
      as         : 'Fighter',
      foreignKey : {
        name      : 'fighterId',
        allowNull : false
      }
    });
    this.belongsTo(Category, {
      as         : 'Category',
      foreignKey : {
        name      : 'categoryId',
        allowNull : false
      }
    });
    this.belongsTo(Competition, {
      as         : 'Competition',
      foreignKey : {
        name      : 'competitionId',
        allowNull : false
      }
    });
  }
}

Card.init({
  id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

  fighterId       : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Fighters', key: 'id' }, allowNull: false },
  clubId          : { type: DT.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Clubs', key: 'id' }, allowNull: false },
  secondaryClubId : { type: DT.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Clubs', key: 'id' }, allowNull: true },
  coachId         : { type: DT.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Coaches', key: 'id' }, allowNull: false },
  categoryId      : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Categories', key: 'id' }, allowNull: false },
  competitionId   : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Competition', key: 'id' }, allowNull: false },

  section    : { type: DT.STRING, allowNull: false },
  weight     : { type: DT.FLOAT, allowNull: false },
  realWeight : { type: DT.FLOAT, allowNull: false },
  group      : { type: DT.ENUM([ 'A', 'B' ]), allowNull: true },
  city       : { type: DT.STRING, allowNull: false },
  birthDate  : { type: DT.DATE, allowNull: false },
  age        : {
    type: DT.VIRTUAL,
    get () {
      const today = new Date();
      const birthDate = new Date(this.birthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    set () {
      throw new Error('Do not try to set the `age` value!');
    }
  },

  createdAt : { type: DT.DATE, allowNull: false },
  deletedAt : { type: DT.DATE, allowNull: true },
  updatedAt : { type: DT.DATE, allowNull: false }
}, {
  hooks: {
    beforeCreate     : assignCategoryHook,
    afterCreate      : calculateFightsHook,
    beforeBulkCreate : assignBulkCategoryHook
  },
  sequelize,
  paranoid: true
});

async function assignCategoryHook (card, options) {
  const Fighter = sequelize.model('Fighter');
  const Category = sequelize.model('Category');

  const fighter = await Fighter.findById(card.fighterId);
  const category = await Category.findOne({
    where: {
      weightFrom    : { [Op.lte]: card.weight },
      weightTo      : { [Op.gte]: card.weight },
      ageFrom       : { [Op.lte]: card.age },
      ageTo         : { [Op.gte]: card.age },
      group         : card.group,
      section       : card.section,
      sex           : fighter.sex,
      competitionId : card.competitionId
    }
  });
  card.categoryId = category.id;
}

async function calculateFightsHook (card) {
  const Category = sequelize.model('Category');
  const category = await Category.findById(card.categoryId);
  await category.calculateFights();
}

async function assignBulkCategoryHook (cards, options) {
  const Fighter = sequelize.model('Fighter');
  const Category = sequelize.model('Category');

  await Promise.all(cards.map(async card => {
    const fighter = await Fighter.findById(card.fighterId);
    const category = await Category.findOne({
      where: {
        weightFrom    : { [Op.lte]: card.weight },
        weightTo      : { [Op.gte]: card.weight },
        ageFrom       : { [Op.lte]: card.age },
        ageTo         : { [Op.gte]: card.age },
        group         : card.group,
        section       : card.section,
        sex           : fighter.sex,
        competitionId : card.competitionId
      }
    });
    card.categoryId = category.id;
  }));
}
