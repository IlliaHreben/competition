/* eslint-disable import/no-commonjs */
const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable('Categories', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

      name       : { type: Sequelize.STRING, allowNull: false },
      sex        : { type: Sequelize.ENUM([ 'men', 'women' ]), allowNull: false },
      type       : { type: Sequelize.ENUM([ 'full', 'light' ]), allowNull: false },
      ageFrom    : { type: Sequelize.INTEGER, allowNull: false },
      ageTo      : { type: Sequelize.INTEGER, allowNull: false },
      weightFrom : { type: Sequelize.FLOAT, allowNull: false },
      weightTo   : { type: Sequelize.FLOAT, allowNull: false },
      weightName : { type: Sequelize.STRING, allowNull: false },

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
    await queryInterface.dropTable('Categories');

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = { up, down };
