import sequelize, { DT } from '../sequelize-singleton.js';

import Base from './Base.js';

export default class FightFormula extends Base {
  static initRelation() {
    const Fight = sequelize.model('Fight');
    const Competition = sequelize.model('Competition');
    const Section = sequelize.model('Section');

    this.hasMany(Fight, {
      as: 'Fights',
      foreignKey: {
        name: 'formulaId',
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
    this.belongsTo(Competition, {
      as: 'Competition',
      foreignKey: {
        name: 'competitionId',
        allowNull: false,
      },
    });
  }

  async assignFightsToFormula() {
    const Category = sequelize.model('Category');
    const Fight = sequelize.model('Fight');
    const {
      sectionId,
      competitionId,
      weightFrom,
      weightTo,
      ageFrom,
      ageTo,
      group,
      degree,
      sex,
      type,
    } = this;
    const query = {
      ...(group && { group }),
      ...(sex && { sex }),
      competitionId,
    };
    const scope = Object.entries({ sectionId, weightFrom, weightTo, ageFrom, ageTo, type }).map(
      (filter) => ({ method: filter })
    );

    const categories = await Category.scope(...scope).findAll(query);
    const categoryIds = categories.map((category) => category.id);

    await Fight.update({ where: { categoryId: categoryIds, degree }, formulaId: this.id });
  }

  static initScopes() {
    const scopes = {
      fights: { include: ['Fights'] },
    };

    Object.entries(scopes).forEach((scope) => this.addScope(...scope));
  }
}

FightFormula.init(
  {
    id: {
      type: DT.UUID,
      defaultValue: DT.UUIDV4,
      primaryKey: true,
    },

    sex: { type: DT.ENUM(['man', 'woman']), allowNull: false },
    ageFrom: { type: DT.INTEGER, allowNull: false },
    ageTo: { type: DT.INTEGER, allowNull: false },
    weightFrom: { type: DT.FLOAT, allowNull: false },
    weightTo: { type: DT.FLOAT, allowNull: false },
    weightName: { type: DT.STRING, allowNull: false },
    group: {
      type: DT.ENUM(['A', 'B']),
      allowNull: true,
      validate: {
        groupByType(group, next) {
          this.getSection()
            .then((section) => {
              if (section.type === 'full' && !group) {
                next('Full category must have group.');
              }
              next();
            })
            .catch((err) => next(err));
        },
      },
    },

    sectionId: {
      type: DT.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'Sections', key: 'id' },
      allowNull: false,
    },
    competitionId: {
      type: DT.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'Competitions', key: 'id' },
      allowNull: false,
    },

    roundCount: { type: DT.INTEGER, allowNull: false },
    roundTime: { type: DT.INTEGER, allowNull: false },
    breakTime: { type: DT.INTEGER, allowNull: false },

    createdAt: { type: DT.DATE, allowNull: false },
    updatedAt: { type: DT.DATE, allowNull: false },
    deletedAt: { type: DT.DATE, allowNull: true },
  },
  {
    sequelize,
  }
);
