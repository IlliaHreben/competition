import sequelize, { DT } from '../sequelize-singleton.js';
import Base from './Base.js';

import Fight from './Fight.js';
import Competition from './Competition.js';

export default class FightSpace extends Base {
  static initRelation() {
    this.hasMany(Fight, {
      as: 'Fights',
      foreignKey: {
        name: 'fightSpaceId',
        allowNull: true,
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
}

FightSpace.init(
  {
    id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

    type: { type: DT.ENUM(['ring', 'tatami']), allowNull: false },
    orderNumber: { type: DT.INTEGER, allowNull: false },
    competitionDay: { type: DT.INTEGER, allowNull: false },

    competitionId: {
      type: DT.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'Competitions', key: 'id' },
      allowNull: false,
    },

    startAt: { type: DT.TIME, allowNull: false },
    finishAt: { type: DT.TIME, allowNull: false },
    breakStartAt: { type: DT.TIME, allowNull: false },
    breakFinishAt: { type: DT.TIME, allowNull: false },

    createdAt: { type: DT.DATE, allowNull: false, defaultValue: new Date() },
    deletedAt: { type: DT.DATE, allowNull: true },
    updatedAt: { type: DT.DATE, allowNull: false, defaultValue: new Date() },
  },
  {
    sequelize,
  }
);
