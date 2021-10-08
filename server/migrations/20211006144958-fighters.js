/* eslint-disable import/no-commonjs */

const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable('Fighters', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

      name      : { type: Sequelize.STRING, allowNull: false },
      lastName  : { type: Sequelize.STRING, allowNull: false },
      sex       : { type: Sequelize.ENUM([ 'man', 'woman' ]), allowNull: false },
      city      : { type: Sequelize.STRING, allowNull: false },
      group     : { type: Sequelize.ENUM([ 'A', 'B' ]), allowNull: true },
      birthDate : { type: Sequelize.DATE, allowNull: false },

      clubId  : { type: Sequelize.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Clubs', key: 'id' }, allowNull: false },
      coachId : { type: Sequelize.UUID, onDelete: 'RESTRICT', onUpdate: 'CASCADE', references: { model: 'Coaches', key: 'id' }, allowNull: false },

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
    await queryInterface.dropTable('Fighters', { transaction });
    await queryInterface.sequelize.query('DROP TYPE "enum_Fighters_sex"', { transaction });
    await queryInterface.sequelize.query('DROP TYPE "enum_Fighters_group"', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = { up, down };
