/* eslint-disable import/no-commonjs */
const sections = [
  'full-contact', 'low-kick', 'low-kick-light', 'K-1-light',
  'K-1', 'light-contact', 'semi-contact', 'point-fighting'
];

const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable('Cards', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

      weight     : { type: Sequelize.FLOAT, allowNull: false },
      realWeight : { type: Sequelize.FLOAT, allowNull: false },
      group      : { type: Sequelize.ENUM([ 'A', 'B' ]), allowNull: true },
      city       : { type: Sequelize.STRING, allowNull: false },
      section    : { type: Sequelize.ENUM(sections), allowNull: false },
      birthDate  : { type: Sequelize.DATE, allowNull: false },

      fighterId       : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Fighters', key: 'id' }, allowNull: false },
      clubId          : { type: Sequelize.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Clubs', key: 'id' }, allowNull: false },
      secondaryClubId : { type: Sequelize.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Clubs', key: 'id' }, allowNull: true },
      categoryId      : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Fighters', key: 'id' }, allowNull: true },
      competitionId   : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Competitions', key: 'id' }, allowNull: false },
      coachId         : { type: Sequelize.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Coaches', key: 'id' }, allowNull: false },

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
    await queryInterface.dropTable('Cards', { transaction });
    await queryInterface.sequelize.query('DROP TYPE "enum_Cards_section"', { transaction });
    await queryInterface.sequelize.query('DROP TYPE "enum_Cards_group"', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = { up, down };
