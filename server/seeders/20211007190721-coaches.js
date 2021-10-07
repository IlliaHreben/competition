/* eslint-disable import/no-commonjs */
const coaches = require('../fixtures/coaches.json');
const clubsToCoaches = require('../fixtures/clubsToCoaches.json');

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('Coaches', coaches, { transaction });
      await queryInterface.bulkInsert('ClubsToCoaches', clubsToCoaches, { transaction });

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
      await queryInterface.bulkDelete('Coaches', {}, { transaction });
      await queryInterface.bulkDelete('ClubsToCoaches', {}, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw error;
    }
  }
};
