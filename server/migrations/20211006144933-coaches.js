/* eslint-disable import/no-commonjs */

const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable('Coaches', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

      name     : { type: Sequelize.STRING, allowNull: false },
      lastName : { type: Sequelize.STRING, allowNull: false },

      createdAt : { type: Sequelize.DATE, allowNull: false },
      deletedAt : { type: Sequelize.DATE, allowNull: true },
      updatedAt : { type: Sequelize.DATE, allowNull: false }
    }, { transaction });

    await queryInterface.createTable('ClubsToCoaches', {
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

      deletedAt : { type: Sequelize.DATE, allowNull: true },
      createdAt : { type: Sequelize.DATE, allowNull: false },
      updatedAt : { type: Sequelize.DATE, allowNull: false }
    }, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const down = async (queryInterface) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.dropTable('ClubsToCoaches', { transaction });
    await queryInterface.dropTable('Coaches', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = { up, down };
