import Sequelize from 'sequelize';
import sequelize from '../sequelize-singleton.js';
import Base      from './Base.js';

// import Coach             from './Coach.js';

export default class Club extends Base {
  static initRelation () {
    const Coach = sequelize.model('Coach');
    const Card = sequelize.model('Card');

    this.belongsToMany(Coach, {
      as         : 'Coaches',
      through    : 'ClubsToCoaches',
      foreignKey : {
        name      : 'clubId',
        allowNull : false
      },
      onDelete : 'cascade',
      onUpdate : 'cascade'
    });

    this.hasMany(Card, {
      as         : 'Cards',
      foreignKey : {
        name      : 'clubId',
        allowNull : false
      }
    });
  }

  static initScopes () {
    const Card = sequelize.model('Card');

    const scopes = {
      coachId: id => ({
        where   : { '$Coach.id$': id },
        include : 'Coach'
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
      })
    };

    Object.entries(scopes).forEach(scope => this.addScope(...scope));
  }
}

Club.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  name: { type: Sequelize.STRING, allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  deletedAt : { type: Sequelize.DATE, allowNull: true },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
