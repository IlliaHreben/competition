import sequelize, { DT, Op } from '../sequelize-singleton.js';
import Base from './Base.js';

import Club from './Club.js';
import Coach from './Coach.js';
import Card from './Card.js';

export default class Fighter extends Base {
  static initRelation() {
    this.belongsTo(Club, {
      as: 'Club',
      foreignKey: {
        name: 'clubId',
        allowNull: false,
      },
    });
    this.belongsTo(Club, {
      as: 'SecondaryClub',
      foreignKey: {
        name: 'secondaryClubId',
        allowNull: true,
      },
    });
    this.belongsTo(Coach, {
      as: 'Coach',
      foreignKey: {
        name: 'coachId',
        allowNull: false,
      },
    });

    this.hasMany(Card, {
      as: 'Cards',
      foreignKey: {
        name: 'fighterId',
        allowNull: false,
      },
    });
  }

  static initScopes() {
    const Club = sequelize.model('Club');
    const Settlement = sequelize.model('Settlement');

    const scopes = {
      cards: {
        include: ['Cards'],
      },
      coach: {
        include: ['Coach'],
      },
      club: {
        include: [
          {
            model: Club,
            as: 'Club',
            include: { model: Settlement, as: 'Settlement', include: 'State' },
          },
        ],
      },
      search: (search) => ({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
          ],
        },
      }),
      clubId: (clubId) => ({ where: { clubId } }),
      coachId: (coachId) => ({ where: { coachId } }),
      settlementId: (settlementId) => ({
        where: { '$Club.settlementId$': settlementId },
        include: 'Club',
      }),
      group: (group) => ({ where: { group } }),
      sex: (sex) => ({
        where: { sex },
      }),
    };

    Object.entries(scopes).forEach((scope) => this.addScope(...scope));
  }
}

Fighter.init(
  {
    id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

    name: { type: DT.STRING, allowNull: false },
    lastName: { type: DT.STRING, allowNull: false },
    sex: { type: DT.ENUM(['man', 'woman']), allowNull: false },
    clubId: {
      type: DT.UUID,
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      references: { model: 'Clubs', key: 'id' },
      allowNull: true,
    },
    coachId: {
      type: DT.UUID,
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      references: { model: 'Coaches', key: 'id' },
      allowNull: true,
    },
    secondaryClubId: {
      type: DT.UUID,
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      references: { model: 'Clubs', key: 'id' },
      allowNull: true,
    },
    birthDate: { type: DT.DATE, allowNull: true },
    group: { type: DT.ENUM(['A', 'B']), allowNull: true },
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
    sequelize,
    paranoid: true,
  }
);
