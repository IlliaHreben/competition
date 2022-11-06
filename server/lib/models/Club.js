import Sequelize from 'sequelize';
import sequelize from '../sequelize-singleton.js';
import Base from './Base.js';
import ServiceError from '../services/service-error.js';

// import Coach             from './Coach.js';

export default class Club extends Base {
  static initRelation() {
    const Coach = sequelize.model('Coach');
    const Fighter = sequelize.model('Fighter');
    const Settlement = sequelize.model('Settlement');

    this.belongsToMany(Coach, {
      as: 'Coaches',
      through: 'ClubsToCoaches',
      foreignKey: {
        name: 'clubId',
        allowNull: false,
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    this.hasMany(Fighter, {
      as: 'Fighters',
      foreignKey: {
        name: 'clubId',
        allowNull: false,
      },
    });

    this.belongsTo(Settlement, {
      as: 'Settlement',
      foreignKey: {
        name: 'settlementId',
        allowNull: false,
      },
    });
  }

  async updateClub(data, linked) {
    if (data.settlementId) {
      const Settlement = sequelize.model('Settlement');

      const settlement = await Settlement.findById(data.settlementId);
      if (!settlement) throw new ServiceError('SETTLEMENT_NOT_FOUND');
    }

    await this.update(data);

    if (linked.coaches) {
      const Coach = sequelize.model('Coach');

      const coaches = await this.getCoaches();
      const toDelete = coaches.filter((coach) => !linked.coaches.includes(coach.id));
      await this.removeCoaches(toDelete);
      const toCreateIds = linked.coaches.filter(
        (coachId) => !coaches.some((coach) => coach.id === coachId)
      );
      const coachesToCreate = await Coach.findAll({
        where: { id: toCreateIds },
      });
      await this.linkCoaches(coachesToCreate);
    }
  }

  async linkCoaches(coachesToLink) {
    const Coach = sequelize.model('Coach');

    const coaches = await Coach.findAll({
      where: { id: coachesToLink.map((c) => c.id) },
    });
    await this.addCoaches(coaches);
    this.Coaches = coaches;
  }

  static initScopes() {
    const Card = sequelize.model('Card');
    const Fighter = sequelize.model('Fighter');
    const Settlement = sequelize.model('Settlement');

    const scopes = {
      coachId: (id) => ({
        where: { '$Coaches.id$': id },
        include: 'Coaches',
      }),
      competitionId: (id) => ({
        include: [
          {
            model: Fighter,
            as: 'Fighters',
            include: [
              {
                as: 'Cards',
                model: Card,
                where: { competitionId: id },
                required: true,
                distinct: true,
                limit: 1,
              },
            ],
            required: true,
            distinct: true,
            limit: 1,
          },
        ],
      }),
      coaches: { include: 'Coaches' },
      settlement: {
        include: { model: Settlement, as: 'Settlement', include: 'State' },
      },
    };

    Object.entries(scopes).forEach((scope) => this.addScope(...scope));
  }
}

Club.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    name: { type: Sequelize.STRING, allowNull: false },
    settlementId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'Settlements', key: 'id' },
      allowNull: false,
    },

    createdAt: { type: Sequelize.DATE, allowNull: false },
    deletedAt: { type: Sequelize.DATE, allowNull: true },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  },
  {
    sequelize,
    paranoid: true,
  }
);
