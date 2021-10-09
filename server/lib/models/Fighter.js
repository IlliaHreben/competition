import sequelize, { DT } from '../sequelize-singleton.js';
import Base              from './Base.js';

import Club              from './Club.js';
import Coach             from './Coach.js';

export default class Fighter extends Base {
  static initRelation () {
    this.belongsTo(Club, {
      as         : 'Club',
      foreignKey : {
        name      : 'clubId',
        allowNull : false
      }
    });

    this.belongsTo(Coach, {
      as         : 'Coach',
      foreignKey : {
        name      : 'coachId',
        allowNull : false
      }
    });
  }
}

Fighter.init({
  id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

  section   : { type: DT.STRING, allowNull: false },
  name      : { type: DT.STRING, allowNull: false },
  lastName  : { type: DT.STRING, allowNull: false },
  sex       : { type: DT.ENUM([ 'man', 'woman' ]), allowNull: false },
  city      : { type: DT.STRING, allowNull: false },
  clubId    : { type: DT.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Clubs', key: 'id' }, allowNull: false },
  coachId   : { type: DT.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Coaches', key: 'id' }, allowNull: false },
  birthDate : { type: DT.DATE, allowNull: false },
  group     : { type: DT.ENUM([ 'A', 'B' ]), allowNull: true },
  age       : {
    type: DT.VIRTUAL,
    get () {
      const today = new Date();
      const birthDate = new Date(this.birthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    set () {
      throw new Error('Do not try to set the `age` value!');
    }
  },

  createdAt : { type: DT.DATE, allowNull: false },
  deletedAt : { type: DT.DATE, allowNull: true },
  updatedAt : { type: DT.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
