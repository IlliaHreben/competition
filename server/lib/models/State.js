import Sequelize from 'sequelize';
import sequelize from '../sequelize-singleton.js';
import Base      from './Base.js';

// import Coach             from './Coach.js';

export default class Settlement extends Base {
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

  // static initScopes () {
  //   const Card = sequelize.model('Card');

  //   const scopes = {
  //     coachId: id => ({
  //       where   : { '$Coaches.id$': id },
  //       include : 'Coaches'
  //     }),
  //     competitionId: id => ({
  //       include: [ {
  //         as       : 'Cards',
  //         model    : Card,
  //         where    : { competitionId: id },
  //         required : true,
  //         distinct : true,
  //         limit    : 1
  //       } ]
  //     })
  //   };

  //   Object.entries(scopes).forEach(scope => this.addScope(...scope));
  // }
}

Settlement.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  name: { type: Sequelize.STRING, allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize
});
