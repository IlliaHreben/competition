import Sequelize from 'sequelize';
import sequelize from '../sequelize-singleton.js';
import Base from './Base.js';

export default class Coach extends Base {
  static initRelation() {
    const Club = sequelize.model('Club');
    const Fighter = sequelize.model('Fighter');

    this.belongsToMany(Club, {
      as: 'Clubs',
      through: 'ClubsToCoaches',
      foreignKey: {
        name: 'coachId',
        allowNull: false,
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    this.hasMany(Fighter, {
      as: 'Fighters',
      foreignKey: {
        name: 'coachId',
        allowNull: false,
      },
    });
  }

  async updateCoach(data, linked) {
    // if (data.assistantId) {
    //   const Settlement = sequelize.model('Settlement');

    //   const settlement = await Settlement.findById(data.settlementId);
    //   if (!settlement) throw new ServiceError('SETTLEMENT_NOT_FOUND');
    // }

    await this.update(data);
    if (linked.clubs) {
      const clubs = await this.getClubs();
      const toDelete = clubs.filter((club) => !linked.clubs.includes(club.id));
      await this.removeClubs(toDelete);
      const toCreateIds = linked.clubs.filter(
        (clubId) => !clubs.some((club) => club.id === clubId)
      );
      await this.associateClubs(toCreateIds);
    }
  }

  async associateClubs(clubIds) {
    const Club = sequelize.model('Club');

    const clubs = await Club.findAll({ where: { id: clubIds } });
    await this.addClubs(clubs);
    this.Clubs = clubs;
  }

  static initScopes() {
    const Card = sequelize.model('Card');
    const Fighter = sequelize.model('Fighter');

    const scopes = {
      clubId: (id) => ({
        where: { '$Clubs.id$': id },
        include: 'Clubs',
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
      clubs: { include: 'Clubs' },
    };

    Object.entries(scopes).forEach((scope) => this.addScope(...scope));
  }
}

Coach.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    name: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },

    assistantName: { type: Sequelize.STRING, allowNull: true },
    assistantLastName: { type: Sequelize.STRING, allowNull: true },

    createdAt: { type: Sequelize.DATE, allowNull: false },
    deletedAt: { type: Sequelize.DATE, allowNull: true },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  },
  {
    sequelize,
    paranoid: true,
  }
);
