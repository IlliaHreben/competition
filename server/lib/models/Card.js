import sequelize, { Op, DT } from '../sequelize-singleton.js';

import Base                  from './Base.js';
import Club                  from './Club.js';
import Coach                 from './Coach.js';
import Fighter               from './Fighter.js';
import Category              from './Category.js';
import Competition           from './Competition.js';

export default class Card extends Base {
  static initRelation () {
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
    beforeValidate : assignCategoryHook,
    beforeCreate   : (card) => {
      console.log('='.repeat(50)); // !nocommit
      console.log(card);
      console.log('='.repeat(50));
    }
  },
  sequelize,
  paranoid: true
});

async function assignCategoryHook (card, options) {
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
