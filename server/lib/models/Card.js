import sequelize, { Op, DT } from '../sequelize-singleton.js';
import ServiceError          from '../services/service-error.js';

import Base                  from './Base.js';

export default class Card extends Base {
  static initRelation () {
    const Club = sequelize.model('Club');
    const Coach = sequelize.model('Coach');
    const Fighter = sequelize.model('Fighter');
    const Category = sequelize.model('Category');
    const Competition = sequelize.model('Competition');
    const Section = sequelize.model('Section');

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
    // this.belongsTo(Competition, {
    //   as         : 'Competition',
    //   foreignKey : {
    //     name      : 'competitionId',
    //     allowNull : false
    //   }
    // });
    this.belongsTo(Competition, {
      as         : 'Competition',
      foreignKey : {
        name      : 'competitionId',
        allowNull : false
      }
    });
    this.belongsTo(Section, {
      as         : 'Section',
      foreignKey : {
        name      : 'sectionId',
        allowNull : false
      }
    });
  }

  static initScopes () {
    const Category = sequelize.model('Category');
    const Fighter = sequelize.model('Fighter');
    const Club = sequelize.model('Club');

    const scopes = {
      fighter: {
        include: [ 'Fighter' ]
      },
      coach: {
        include: [ 'Coach' ]
      },
      category: {
        include: [ { model: Category, as: 'Category', include: [ 'Section' ] } ]
      },
      club: {
        include: [ { model: Club, as: 'Club', include: 'Settlement' } ]
      },
      competitionRelated: (id) => {
        return {
          where: {
            '$Section.competitionId$': id
          },
          include: 'Section'
        };
      },
      sectionId    : (sectionId) => ({ where: { sectionId } }),
      clubId       : (clubId) => ({ where: { clubId } }),
      coachId      : (coachId) => ({ where: { coachId } }),
      settlementId : (settlementId) => ({
        where   : { '$Club.settlementId$': settlementId },
        include : 'Club'
      }),
      group : (group) => ({ where: { group } }),
      sex   : sex => ({
        include: [ {
          as       : 'Fighter',
          model    : Fighter,
          where    : { sex },
          required : true
        } ]
      })
    };

    Object.entries(scopes).forEach(scope => this.addScope(...scope));
  }

  async updateCard (data) {
    const Club = sequelize.model('Club');
    const Coach = sequelize.model('Coach');
    const Section = sequelize.model('Section');
    const Category = sequelize.model('Category');
    const Fighter = sequelize.model('Fighter');

    if (data.fighterId) {
      const fighter = await Fighter.findById(data.fighterId);
      if (!fighter) throw new ServiceError('FIGHTER_NOT_FOUND');
    }
    if (data.clubId) {
      const club = await Club.findById(data.clubId);
      if (!club) throw new ServiceError('CLUB_NOT_FOUND');
    }
    if (data.coachId) {
      const coach = await Coach.findById(data.coachId);
      if (!coach) throw new ServiceError('COACH_NOT_FOUND');
    }
    if (data.sectionId) {
      const section = await Section.findById(data.sectionId);
      if (!section) throw new ServiceError('SECTION_NOT_FOUND');
      if (section.type === 'full' && !data.group && !this.group) {
        throw new ServiceError('GROUP_DOES_NOT_EXIST');
      }
      if (section.type === 'light' && data.group !== null && this.group !== null) {
        throw new ServiceError('GROUP_CANNOT_EXIST');
      }
    } else if (data.group !== undefined) {
      const section = await Section.findById(this.sectionId);
      if (section.type === 'full' && !data.group) {
        throw new ServiceError('GROUP_DOES_NOT_EXIST');
      }
      if (section.type === 'light' && data.group !== null) {
        throw new ServiceError('GROUP_CANNOT_EXIST');
      }
    }

    const oldCategoryId = this.categoryId;
    const category = await Category.findById(oldCategoryId);
    await category.calculateFights();

    await this.update(data);
    await this.assignCategory();
    await this.calculateFights();

    return this;
  }

  async assignCategory () {
    const Fighter = sequelize.model('Fighter');
    const Category = sequelize.model('Category');

    const fighter = await Fighter.findById(this.fighterId);
    const category = await Category.findOne({
      where: {
        weightFrom    : { [Op.lte]: this.weight },
        weightTo      : { [Op.gte]: this.weight },
        ageFrom       : { [Op.lte]: this.age },
        ageTo         : { [Op.gte]: this.age },
        group         : this.group,
        sectionId     : this.sectionId,
        sex           : fighter.sex,
        competitionId : this.competitionId
      }
    });
    await this.update({ categoryId: category?.id });
  }

  async calculateFights () {
    const Category = sequelize.model('Category');
    const category = await Category.findById(this.categoryId);
    await category.calculateFights();
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
  sectionId       : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Sections', key: 'id' }, allowNull: false },

  weight     : { type: DT.FLOAT, allowNull: false },
  realWeight : { type: DT.FLOAT, allowNull: false },
  group      : { type: DT.ENUM([ 'A', 'B' ]), allowNull: true },
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
      sectionId     : card.sectionId,
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

  await Promise.all(cards.map(async (card, i) => {
    const fighter = await Fighter.findById(card.fighterId);
    const category = await Category.findOne({
      where: {
        weightFrom : { [Op.lte]: card.weight },
        weightTo   : { [Op.gte]: card.weight },
        ageFrom    : { [Op.lte]: card.age },
        ageTo      : { [Op.gte]: card.age },
        group      : card.group,
        sectionId  : card.sectionId,
        sex        : fighter.sex
      }
    });
    if (!category) throw new Error(`Category for card ${card.id} not found.`);
    card.categoryId = category.id;
  }));
}
