/* eslint-disable import/no-commonjs */
// const clubs = require('../fixtures/clubs.json');
// const coaches = require('../fixtures/coaches.json');
// const oldFighters = require('../fixtures/oldFighters.json');
// const fighters = require('../fixtures/fighters.json')
// const cards = require('../fixtures/cards.json');;
// const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // // const mapping = {
    // //   ЛОУ   : 'low-kick',
    // //   'К-1' : 'K-1',
    // //   ЛКЛ   : 'low-kick-light',
    // //   ЛАЙТ  : 'light-contact',
    // //   СК    : 'semi-contact',
    // //   ФУЛ   : 'full-contact'
    // // };
    // // const cross = oldFighters
    // //   .filter((e, i) => oldFighters.findIndex(a => a.name + a.lastName === e.name + e.lastName) === i)

    // //   .map(c => c.categories.map(cate => ({
    // //     id            : uuid(),
    // //     fighterId     : fighters.find(f => f.name === c.name && c.lastName === f.lastName).id,
    // //     clubId        : clubs.find(a => a.name === c.club).id,
    // //     competitionId : 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb',
    // //     city          : c.city,
    // //     coachId       : coaches.find(a => c.trainer.includes(`${a.lastName} ${a.name}`))?.id,
    // //     birthDate     : new Date(c.birthDate),
    // //     weight        : c.weight,
    // //     realWeight    : c.weight,
    // //     group         : [ 'ЛКЛ', 'ЛАЙТ', 'СК' ].includes(cate)
    // //       ? null
    // //       : { А: 'A', Б: 'B' }[c.group],

    // //     section   : mapping[cate],
    // //     createdAt : new Date(),
    // //     updatedAt : new Date()
    // //   }))).flat();

    // const transaction = await queryInterface.sequelize.transaction();
    // try {
    //   await queryInterface.bulkInsert('Cards', cards, { returning: true, transaction });

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
