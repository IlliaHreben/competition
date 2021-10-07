/* eslint-disable import/no-commonjs */
const categories = require('../fixtures/categories.json');

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('Categories', categories, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw error;
    }
  },
  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete('Categories', {}, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw error;
    }
  }
};
