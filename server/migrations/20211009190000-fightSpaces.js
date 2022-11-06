/* eslint-disable import/no-commonjs */
const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable(
      'FightSpaces',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },

        type: { type: Sequelize.ENUM(['ring', 'tatami']), allowNull: false },
        orderNumber: { type: Sequelize.INTEGER, allowNull: false },
        competitionDay: { type: Sequelize.INTEGER, allowNull: false },

        competitionId: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: { model: 'Competitions', key: 'id' },
          allowNull: false,
        },

        createdAt: { type: Sequelize.DATE, allowNull: false },
        deletedAt: { type: Sequelize.DATE, allowNull: true },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
      },
      { transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const down = async (queryInterface) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.dropTable('FightSpaces', { transaction });
    await queryInterface.sequelize.query('DROP TYPE "enum_FightSpaces_type"', {
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = { up, down };
