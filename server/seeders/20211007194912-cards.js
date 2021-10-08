/* eslint-disable import/no-commonjs */
// const clubs = require('../fixtures/clubs.json');
// const coaches = require('../fixtures/coaches.json');
// const oldFighters = require('../fixtures/oldFighters.json');
// const fighters = require('../fixtures/fighters.json');
// const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // const cross = oldFighters
    //   .filter((e, i) => oldFighters.findIndex(a => a.name + a.lastName === e.name + e.lastName) === i)

    //   .map(c => ({
    //     id            : uuid(),
    //     fighterId     : fighters.find(f => f.name === c.name && c.lastName === f.lastName).id,
    //     clubId        : clubs.find(a => a.name === c.club).id,
    //     competitionId : 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb',
    //     city          : c.city,
    //     coachId       : coaches.find(a => c.trainer.includes(`${a.lastName} ${a.name}`))?.id,
    //     birthDate     : new Date(c.birthDate),
    //     weight        : c.weight,
    //     realWeight    : c.weight,
    //     group         : c.categories.some(c => [ 'ЛКЛ', 'ЛАЙТ', 'СК' ].includes(c))
    //       ? null
    //       : { А: 'A', Б: 'B' }[c.group],
    //     createdAt : new Date(),
    //     updatedAt : new Date()
    //   }));

    // const transaction = await queryInterface.sequelize.transaction();
    // try {
    //   const cc = await queryInterface.bulkInsert('Cards', cross, { returning: true, transaction });
    //   console.log(JSON.stringify(cc));

    //   await transaction.commit();
    // } catch (error) {
    //   await transaction.rollback();
    //   console.error(error);
    //   throw error;
    // }
  },
  down: async (queryInterface) => {
    // const transaction = await queryInterface.sequelize.transaction();

    // try {
    //   await queryInterface.bulkDelete('Cards', {}, { transaction });

    //   await transaction.commit();
    // } catch (error) {
    //   await transaction.rollback();
    //   console.error(error);
    //   throw error;
    // }
  }
};
