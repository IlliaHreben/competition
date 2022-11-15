/* eslint-disable import/no-commonjs */
const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable(
      'FightFormulas',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },

        sex: { type: Sequelize.ENUM(['man', 'woman']), allowNull: false },
        ageFrom: { type: Sequelize.INTEGER, allowNull: false },
        ageTo: { type: Sequelize.INTEGER, allowNull: false },
        weightFrom: { type: Sequelize.FLOAT, allowNull: false },
        weightTo: { type: Sequelize.FLOAT, allowNull: false },
        group: { type: Sequelize.ENUM(['A', 'B']), allowNull: true },
        degree: { type: Sequelize.INTEGER, allowNull: true },

        competitionId: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: { model: 'Competitions', key: 'id' },
          allowNull: false,
        },
        sectionId: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: { model: 'Sections', key: 'id' },
          allowNull: false,
        },

        roundCount: { type: Sequelize.INTEGER, allowNull: false },
        roundTime: { type: Sequelize.INTEGER, allowNull: false },
        breakTime: { type: Sequelize.INTEGER, allowNull: false },

        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
        deletedAt: { type: Sequelize.DATE, allowNull: true },
      },
      { transaction }
    );

    await queryInterface.addColumn(
      'Fights',
      'formulaId',
      {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: { model: 'FightFormulas', key: 'id' },
        allowNull: true,
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
    await queryInterface.removeConstraint('Fights', 'Fights_formulaId_fkey', {
      transaction,
    });
    await queryInterface.dropTable('FightFormulas', { transaction });

    await queryInterface.removeColumn('Fights', 'formulaId', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = { up, down };
