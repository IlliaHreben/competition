import sequelize, { DT, Op } from '../sequelize-singleton.js';
import ServiceError from '../services/service-error.js';
import Base from './Base.js';

import Card from './Card.js';
import Category from './Category.js';
import FightFormula from './FightFormula.js';
import FightSpace from './FightSpace.js';

export default class Fight extends Base {
  static initRelation() {
    this.belongsTo(Card, {
      as: 'FirstCard',
      foreignKey: {
        name: 'firstCardId',
        allowNull: true,
      },
    });

    this.belongsTo(Card, {
      as: 'SecondCard',
      foreignKey: {
        name: 'secondCardId',
        allowNull: true,
      },
    });

    this.belongsTo(Card, {
      as: 'Winner',
      foreignKey: {
        name: 'winnerId',
        allowNull: true,
      },
    });

    this.belongsTo(Fight, {
      as: 'NextFight',
      foreignKey: {
        name: 'nextFightId',
        allowNull: true,
      },
    });

    this.hasMany(Fight, {
      as: 'PreviousFights',
      foreignKey: {
        name: 'nextFightId',
        allowNull: true,
      },
    });
    this.belongsTo(Category, {
      as: 'Category',
      foreignKey: {
        name: 'categoryId',
        allowNull: false,
      },
    });
    this.belongsTo(FightFormula, {
      as: 'FightFormula',
      foreignKey: {
        name: 'formulaId',
        allowNull: false,
      },
    });
    this.belongsTo(FightSpace, {
      as: 'FightSpace',
      foreignKey: {
        name: 'fightSpaceId',
        allowNull: true,
      },
    });

    // this.belongsTo(FightSpace, {
    //   as         : 'Category',
    //   foreignKey : {
    //     name      : 'fightSpaceId',
    //     allowNull : false
    //   }
    // });
  }

  static async shiftSerialNumber({ fightSpaceId, from, offset, side }) {
    if (!['+', '-'].includes(side)) {
      throw new Error('Offset must be + or -');
    }

    return Fight.update(
      { serialNumber: sequelize.literal(`"serialNumber" ${side} ${offset}`) },
      {
        where: {
          fightSpaceId,
          serialNumber: {
            [Op.gte]: from,
          },
        },
      }
    );
  }

  async setWinner(winnerId) {
    const winner = await Card.findById(winnerId);
    if (!winner) throw new ServiceError('NOT_FOUND', { id: winnerId, entities: ['card'] });

    const nextFight = await this.getNextFight();

    const winnerAlreadyExist = !!this.winnerId;
    if (winnerAlreadyExist) await nextFight?.clearWinStreak(this.winnerId);

    await this.update({ winnerId });

    await nextFight?.setCardFromWinner(winnerId, this.id, this.orderNumber);
  }

  async setCardFromWinner(cardId, fromFightId, fromOrder) {
    const prevFights = await this.getPreviousFights();

    const oppositeFightIndex = +!prevFights.findIndex((f) => f.id === fromFightId);
    const key =
      prevFights[oppositeFightIndex] && fromOrder < prevFights[oppositeFightIndex].orderNumber
        ? 'firstCardId'
        : 'secondCardId';

    await this.update({ [key]: cardId });
  }

  async clearWinStreak(winnerId) {
    const cardKey = ['firstCardId', 'secondCardId'].find((key) => this[key] === winnerId);
    if (!cardKey) return;

    await this.update({ [cardKey]: null, winnerId: null });
    const nextFight = await this.getNextFight();
    if (nextFight) await nextFight.clearWinStreak(winnerId);
  }

  async assignFightFormula() {
    const category = this.Category || (await this.getCategory());
    const where = {
      competitionId: category.competitionId,
      sectionId: category.sectionId,
      group: category.group,
      sex: category.sex,
      weightFrom: { [Op.lte]: category.weightTo },
      weightTo: { [Op.gte]: category.weightFrom },
      ageFrom: { [Op.lte]: category.ageTo },
      ageTo: { [Op.gte]: category.ageFrom },
      [Op.or]: [{ degree: category.degree }, { degree: null }],
    };
    const fightFormulas = await FightFormula.findOne({
      where,
      limit: 2,
    });
    const fightFormula =
      fightFormulas.length === 1
        ? fightFormulas[0]
        : fightFormulas.find((ff) => ff.degree === this.degree);

    this.formulaId = fightFormula.id;
    this.FightFormula = this;

    await this.save();
  }

  static initScopes() {
    const scopes = {
      categoryWithSection: {
        include: [{ model: Category, as: 'Category', include: 'Section' }],
      },
      fightFormula: {
        include: [{ model: FightFormula, as: 'FightFormula' }],
      },
      fightSpace: {
        include: [{ model: FightSpace, as: 'FightSpace' }],
      },
      cardsWithFighter: {
        include: [
          { model: Card, as: 'FirstCard', include: ['Fighter'] },
          { model: Card, as: 'SecondCard', include: ['Fighter'] },
        ],
      },
    };

    Object.entries(scopes).forEach((scope) => this.addScope(...scope));
  }
}

Fight.init(
  {
    id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

    degree: { type: DT.INTEGER, allowNull: false },
    orderNumber: { type: DT.INTEGER, allowNull: false },
    serialNumber: { type: DT.INTEGER, allowNull: true },

    firstCardId: {
      type: DT.UUID,
      references: { model: 'Cards', key: 'id' },
      allowNull: true,
    },
    secondCardId: {
      type: DT.UUID,
      references: { model: 'Cards', key: 'id' },
      allowNull: true,
    },
    winnerId: {
      type: DT.UUID,
      references: { model: 'Cards', key: 'id' },
      allowNull: true,
    },
    nextFightId: {
      type: DT.UUID,
      references: { model: 'Fights', key: 'id' },
      allowNull: true,
    },
    categoryId: {
      type: DT.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'Categories', key: 'id' },
      allowNull: false,
    },
    fightSpaceId: {
      type: DT.UUID,
      references: { model: 'FightSpaces', key: 'id' },
      allowNull: true,
    },
    formulaId: {
      type: DT.UUID,
      references: { model: 'FightFormulas', key: 'id' },
      allowNull: true,
    },

    executedAt: { type: DT.DATE, allowNull: true },
    createdAt: { type: DT.DATE, allowNull: false },
    updatedAt: { type: DT.DATE, allowNull: false },
  },
  {
    sequelize,
  }
);
