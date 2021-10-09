/* eslint-disable import/no-commonjs */
const sections = [
  'full-contact', 'low-kick', 'low-kick-light', 'K-1-light',
  'K-1', 'light-contact', 'semi-contact', 'point-fighting'
];

const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable('Categories', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

      section    : { type: Sequelize.ENUM(sections), allowNull: false },
      sex        : { type: Sequelize.ENUM([ 'man', 'woman' ]), allowNull: false },
      type       : { type: Sequelize.ENUM([ 'full', 'light' ]), allowNull: false },
      ageFrom    : { type: Sequelize.INTEGER, allowNull: false },
      ageTo      : { type: Sequelize.INTEGER, allowNull: false },
      weightFrom : { type: Sequelize.FLOAT, allowNull: false },
      weightTo   : { type: Sequelize.FLOAT, allowNull: false },
      weightName : { type: Sequelize.STRING, allowNull: false },
      group      : { type: Sequelize.ENUM([ 'A', 'B' ]), allowNull: true },

      competitionId: { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Competitions', key: 'id' }, allowNull: false },

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
    await queryInterface.dropTable('Categories', { transaction });
    await queryInterface.sequelize.query('DROP TYPE "enum_Categories_section"', { transaction });
    await queryInterface.sequelize.query('DROP TYPE "enum_Categories_sex"', { transaction });
    await queryInterface.sequelize.query('DROP TYPE "enum_Categories_type"', { transaction });
    await queryInterface.sequelize.query('DROP TYPE "enum_Categories_group"', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = { up, down };
