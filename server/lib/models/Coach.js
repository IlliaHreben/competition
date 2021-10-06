import Sequelize         from 'sequelize';
import sequelize         from '../sequelizeSingleton';
import Base from './Base';

export default class Coach extends Base {
  static initRelation () {
    const Club = sequelize.model('Club');

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
  }
}

Coach.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

  name     : { type: Sequelize.STRING, allowNull: false },
  lastName : { type: Sequelize.STRING, allowNull: false },

  assistantName     : { type: Sequelize.STRING, allowNull: true },
  assistantLastName : { type: Sequelize.STRING, allowNull: false },

  createdAt : { type: Sequelize.DATE, allowNull: false },
  deletedAt : { type: Sequelize.DATE, allowNull: true },
  updatedAt : { type: Sequelize.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
