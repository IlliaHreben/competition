/* eslint-disable import/no-commonjs */
// const categories = require('../etc/categories.json');
const oldCategories = require('../etc/oldCategories.json');
const { v4: uuid } = require('uuid');

export default {
  up: async (queryInterface) => {
    const categories = Object.entries(oldCategories).map(([ sex, typedData ]) => {
      return Object.entries(typedData).map(([ type, data ]) => {
        return data.map(({ age, weight }) => {
          const mapped = weight.map((number, i) => {
            return {
              id         : uuid(),
              sex,
              type,
              ageFrom    : age.from,
              ageTo      : age.to,
              weightFrom : weight[i - 1] ? weight[i - 1] : 0,
              weightTo   : number - 0.1,
              weightName : number,
              createdAt  : new Date(),
              updatedAt  : new Date()
            };
          });
          mapped.push({
            ...mapped[mapped.length - 1],
            weightFrom : mapped[mapped.length - 1].weightTo,
            weightTo   : 999
          });

          return mapped;
        });
      });
    }).flat().flat().flat();
    // console.log(categories.forEach((c, i) => categories.map((cc, k) => cc.id === c.id && k !== i && console.log(cc.id, k))));
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const a = await queryInterface.bulkInsert('Categories', categories.map(c => ({ ...c, id: uuid() })), { transaction });
      console.log(JSON.stringify(a));
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
