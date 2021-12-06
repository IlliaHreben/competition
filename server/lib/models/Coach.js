import Sequelize from 'sequelize';
import sequelize from '../sequelize-singleton.js';
import Base      from './Base.js';

export default class Coach extends Base {
  static initRelation () {
    const Club = sequelize.model('Club');
    const Card = sequelize.model('Card');

    this.belongsToMany(Club, {
      as         : 'Clubs',
      through    : 'ClubsToCoaches',
      foreignKey : {
        name      : 'coachId',
        allowNull : false
      },
      onDelete : 'cascade',
      onUpdate : 'cascade'
    });

    this.hasMany(Card, {
      as         : 'Cards',
      foreignKey : {
        name      : 'coachId',
        allowNull : false
      }
    });
  }

  static initScopes () {
    const Card = sequelize.model('Card');

    const scopes = {
      clubId: id => ({
        where   : { '$Clubs.id$': id },
        include : 'Clubs'
      }),
      competitionId: id => ({
        include: [ {
          as       : 'Cards',
          model    : Card,
          where    : { competitionId: id },
          required : true,
          distinct : true,
          limit    : 1
        } ]
      }),
      clubs: { include: 'Clubs' }
    };

    Object.entries(scopes).forEach(scope => this.addScope(...scope));
  }
}

Coach.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  name     : { type: Sequelize.STRING, allowNull: false },
  lastName : { type: Sequelize.STRING, allowNull: false },

  assistantName     : { type: Sequelize.STRING, allowNull: true },
  assistantLastName : { type: Sequelize.STRING, allowNull: true },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  deletedAt : { type: Sequelize.DATE, allowNull: true },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
