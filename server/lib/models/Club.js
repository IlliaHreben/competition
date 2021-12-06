import Sequelize from 'sequelize';
import sequelize from '../sequelize-singleton.js';
import Base      from './Base.js';

// import Coach             from './Coach.js';

export default class Club extends Base {
  static initRelation () {
    const Coach = sequelize.model('Coach');
    const Card = sequelize.model('Card');
    const Settlement = sequelize.model('Settlement');

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

    this.belongsTo(Settlement, {
      as         : 'Settlement',
      foreignKey : {
        name      : 'settlementId',
        allowNull : false
      }
    });
  }

  static initScopes () {
    const Card = sequelize.model('Card');

    const scopes = {
      coachId: id => ({
        where   : { '$Coaches.id$': id },
        include : 'Coaches'
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
      coaches    : { include: 'Coaches' },
      settlement : { include: 'Settlement' }
    };

    Object.entries(scopes).forEach(scope => this.addScope(...scope));
  }
}

Club.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  name         : { type: Sequelize.STRING, allowNull: false },
  settlementId : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Settlements', key: 'id' }, allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  deletedAt : { type: Sequelize.DATE, allowNull: true },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
