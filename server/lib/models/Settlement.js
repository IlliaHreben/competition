import Sequelize         from 'sequelize';
import sequelize, { Op } from '../sequelize-singleton.js';
import Base              from './Base.js';

export default class Settlement extends Base {
  static initRelation () {
    const State = sequelize.model('State');
    const Club = sequelize.model('Club');

    this.hasMany(Club, {
      as         : 'Clubs',
      foreignKey : {
        name      : 'settlementId',
        allowNull : false
      }
    });

    this.belongsTo(State, {
      as         : 'State',
      foreignKey : {
        name      : 'stateId',
        allowNull : false
      }
    });
  }

  static initScopes () {
    const Club = sequelize.model('Club');
    const Card = sequelize.model('Card');
    const Fighter = sequelize.model('Fighter');

    const scopes = {
      competitionId: competitionId => ({
        include: {
          model   : Club,
          as      : 'Clubs',
          include : {
            model   : Fighter,
            as      : 'Fighters',
            include : {
              model    : Card,
              as       : 'Cards',
              where    : { competitionId },
              required : true
            },
            required: true
          },
          required: true
        }
      }),
      state  : { include: [ 'State' ] },
      search : search => ({
        where: { name: { [Op.iLike]: `%${search}%` } }
      })
    };

    Object.entries(scopes).forEach(scope => this.addScope(...scope));
  }
}

Settlement.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  name    : { type: Sequelize.STRING, allowNull: false },
  stateId : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'States', key: 'id' }, allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize
});
