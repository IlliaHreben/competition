/* eslint-disable import/no-commonjs */
const categories = require('../etc/categories.json');

module.exports = {
  up: async (queryInterface) => {
    // const categories = Object.entries(categoriesFixtures).map(([ sex, typedData ]) => {
    //   return Object.entries(typedData).map(([ type, data ]) => {
    //     return data.map(({ age, weight }) => {
    //       const mapped = weight.map((number, i) => {
    //         return {
    //           id         : uuid(),
    //           sex,
    //           type,
    //           ageFrom    : age.from,
    //           ageTo      : age.to,
    //           weightFrom : weight[i - 1] ? weight[i - 1] + 0.1 : 0,
    //           weightTo   : number
    //         };
    //       });
    //       mapped.push({
    //         ...mapped[mapped.length - 1],
    //         weightFrom : mapped[mapped.length - 1].weightTo,
    //         weightTo   : 999
    //       });

    //       return mapped;
    //     });
    //   });
    // }).flat().flat().flat();

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
