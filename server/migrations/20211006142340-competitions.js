/* eslint-disable import/no-commonjs */
const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable('Competitions', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

      name         : { type: Sequelize.STRING, allowNull: false },
      description  : { type: Sequelize.STRING, allowNull: false },
      startDate    : { type: Sequelize.DATE, allowNull: false },
      endDate      : { type: Sequelize.DATE, allowNull: false },
      days         : { type: Sequelize.INTEGER, allowNull: false },
      ringsCount   : { type: Sequelize.INTEGER, allowNull: false },
      tatamisCount : { type: Sequelize.INTEGER, allowNull: false },

      createdAt : { type: Sequelize.DATE, allowNull: false },
      deletedAt : { type: Sequelize.DATE, allowNull: true },
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
    await queryInterface.dropTable('Competitions');

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = { up, down };
