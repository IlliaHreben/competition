import sequelize, { Op, DT } from '../sequelize-singleton.js';
import ServiceError from '../services/service-error.js';

import Base from './Base.js';

export default class Card extends Base {
  static initRelation() {
    const Fighter = sequelize.model('Fighter');
    const Category = sequelize.model('Category');
    const Competition = sequelize.model('Competition');
    const Section = sequelize.model('Section');

    this.belongsTo(Fighter, {
      as: 'Fighter',
      foreignKey: {
        name: 'fighterId',
        allowNull: false,
      },
    });
    this.belongsTo(Category, {
      as: 'Category',
      foreignKey: {
        name: 'categoryId',
        allowNull: false,
      },
    });
    // this.belongsTo(Competition, {
    //   as         : 'Competition',
    //   foreignKey : {
    //     name      : 'competitionId',
    //     allowNull : false
    //   }
    // });
    this.belongsTo(Competition, {
      as: 'Competition',
      foreignKey: {
        name: 'competitionId',
        allowNull: false,
      },
    });
    this.belongsTo(Section, {
      as: 'Section',
      foreignKey: {
        name: 'sectionId',
        allowNull: false,
      },
    });
  }

  static initScopes() {
    const Category = sequelize.model('Category');
    const Fighter = sequelize.model('Fighter');
    const Club = sequelize.model('Club');
    const Settlement = sequelize.model('Settlement');

    const scopes = {
      fighter: { include: ['Fighter'] },
      section: { include: ['Section'] },
      coach: {
        include: [
          {
            model: Fighter,
            as: 'Fighter',
            include: ['Coach'],
          },
        ],
      },
      category: {
        include: [{ model: Category, as: 'Category', include: ['Section'] }],
      },
      club: {
        include: [
          {
            model: Fighter,
            as: 'Fighter',
            include: [
              {
                model: Club,
                as: 'Club',
                include: {
                  model: Settlement,
                  as: 'Settlement',
                  include: 'State',
                },
              },
            ],
          },
        ],
      },
      competitionRelated: (id) => ({
        where: { '$Section.competitionId$': id },
        include: 'Section',
      }),
      search: (search) => ({
        where: {
          [Op.or]: [
            { '$Fighter.name$': { [Op.iLike]: `%${search}%` } },
            { '$Fighter.lastName$': { [Op.iLike]: `%${search}%` } },
          ],
        },
        include: ['Fighter'],
      }),
      sectionId: (sectionId) => ({ where: { sectionId } }),
      clubId: (clubId) => ({
        where: { '$Fighter.clubId$': clubId },
        include: ['Fighter'],
      }),
      coachId: (coachId) => ({
        where: { '$Fighter.coachId$': coachId },
        include: ['Fighter'],
      }),
      settlementId: (settlementId) => ({
        include: [
          {
            model: Fighter,
            as: 'Fighter',
            required: true,
            include: [
              {
                model: Club,
                as: 'Club',
                where: { settlementId },
                required: true,
                include: {
                  model: Settlement,
                  as: 'Settlement',
                  include: 'State',
                },
              },
            ],
          },
        ],
      }),
      group: (group) => ({ where: { group } }),
      sex: (sex) => ({
        include: [
          {
            as: 'Fighter',
            model: Fighter,
            where: { sex },
            required: true,
          },
        ],
      }),
    };

    Object.entries(scopes).forEach((scope) => this.addScope(...scope));
  }

  static async createCard(data) {
    const card = this.build(data);
    if (!card.realWeight) card.set({ realWeight: card.weight });

    await card.assignCategory();
    if (!card.categoryId) throw new ServiceError('DOESNT_FIT_INTO_ANY_CATEGORY');
    await card.save();
    return card;
  }

  async updateCard(data) {
    const Section = sequelize.model('Section');
    const Fighter = sequelize.model('Fighter');

    if (data.fighterId) {
      const fighter = await Fighter.findById(data.fighterId);
      if (!fighter) throw new ServiceError('FIGHTER_NOT_FOUND');
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
    await this.update(data);
    const oldCategoryId = this.categoryId;
    const category = await this.findCategory();
    if (oldCategoryId !== category.id) await this.moveCardToCategory(category);

    return this;
  }

  async assignCategory() {
    const category = await this.findCategory();

    const updateFunction = this.isNewRecord ? 'set' : 'update';
    await this[updateFunction]({ categoryId: category?.id });
    this.Category = category;
  }

  async calculateFights() {
    const Category = sequelize.model('Category');
    const category = await Category.findById(this.categoryId);
    await category.calculateFights();
  }

  async addCardToCategory(categoryTo) {
    await this.update({ categoryId: categoryTo.id });

    await categoryTo.addFight();
    await categoryTo.calculateFights({ recalculate: true });
  }

  async moveCardToCategory(categoryTo) {
    const categoryFrom = this.Category || (await this.getCategory());

    await this.addCardToCategory(categoryTo);

    await categoryFrom.removeFight();
    await categoryFrom.calculateFights({ recalculate: true });

    return {
      from: categoryFrom,
      to: categoryTo,
    };
  }

  async findCategory() {
    const Fighter = sequelize.model('Fighter');
    const Category = sequelize.model('Category');

    const fighter = await Fighter.findById(this.fighterId);
    return Category.findOne({
      where: {
        weightFrom: { [Op.lte]: this.weight },
        weightTo: { [Op.gte]: this.weight },
        ageFrom: { [Op.lte]: this.age },
        ageTo: { [Op.gte]: this.age },
        group: this.group,
        sectionId: this.sectionId,
        sex: fighter.sex,
        competitionId: this.competitionId,
      },
    });
  }
}

Card.init(
  {
    id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

    fighterId: {
      type: DT.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'Fighters', key: 'id' },
      allowNull: false,
    },
    categoryId: {
      type: DT.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'Categories', key: 'id' },
      allowNull: false,
    },
    competitionId: {
      type: DT.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'Competition', key: 'id' },
      allowNull: false,
    },
    sectionId: {
      type: DT.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'Sections', key: 'id' },
      allowNull: false,
    },

    weight: { type: DT.FLOAT, allowNull: false },
    realWeight: { type: DT.FLOAT, allowNull: false },
    group: { type: DT.ENUM(['A', 'B']), allowNull: true },
    birthDate: { type: DT.DATE, allowNull: false },
    age: {
      type: DT.VIRTUAL,
      get() {
        const today = new Date();
        const birthDate = new Date(this.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      },
      set() {
        throw new Error('Do not try to set the `age` value!');
      },
    },

    createdAt: { type: DT.DATE, allowNull: false },
    deletedAt: { type: DT.DATE, allowNull: true },
    updatedAt: { type: DT.DATE, allowNull: false },
  },
  {
    hooks: {
      beforeCreate: assignCategoryHook,
      afterCreate: calculateFightsHook,
      beforeBulkCreate: assignBulkCategoryHook,
    },
    sequelize,
    paranoid: true,
  }
);

async function assignCategoryHook(card, options) {
  const category = await await card.findCategory();
  card.categoryId = category.id;
}

async function calculateFightsHook(card) {
  const Category = sequelize.model('Category');
  const category = await Category.findById(card.categoryId);
  await category.calculateFights();
}

async function assignBulkCategoryHook(cards, options) {
  await Promise.all(
    cards.map(async (card, i) => {
      const category = await card.findCategory();
      if (!category) throw new Error(`Category for card ${card.id} not found.`);
      card.categoryId = category.id;
    })
  );
}
