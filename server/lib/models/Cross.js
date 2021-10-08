import Sequelize from 'sequelize';
import sequelize from '../sequelize-singleton';
import Base      from './Base';

export class ClubsToCoaches extends Base {}

ClubsToCoaches.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  coachId: {
    type       : Sequelize.UUID,
    references : {
      model : 'Coaches',
      key   : 'id'
    },
    onDelete : 'CASCADE',
    onUpdate : 'CASCADE'
  },
  clubId: {
    type       : Sequelize.UUID,
    references : {
      model : 'Clubs',
      key   : 'id'
    },
    onUpdate : 'CASCADE',
    onDelete : 'CASCADE'
  },

  createdAt : { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  deletedAt : { type: Sequelize.DATE, allowNull: true },
  updatedAt : { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
}, { sequelize });
