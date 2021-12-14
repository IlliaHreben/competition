import Sequelize         from 'sequelize';
import sequelize, { Op } from '../sequelize-singleton.js';
import Base              from './Base.js';

// import Coach             from './Coach.js';

export default class State extends Base {
  static initRelation () {
    const Settlement = sequelize.model('Settlement');

    this.hasMany(Settlement, {
      as         : 'Settlements',
      foreignKey : {
        name      : 'stateId',
        allowNull : false
      }
    });
  }

  static initScopes () {
    const scopes = {
      search: search => ({
        where: {
          name: { [Op.iLike]: `%${search}%` }
        }
      })
    };

    Object.entries(scopes).forEach(scope => this.addScope(...scope));
  }
}

State.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  name: { type: Sequelize.STRING, allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize
});
