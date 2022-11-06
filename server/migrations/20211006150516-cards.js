/* eslint-disable import/no-commonjs */

const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable(
      'Cards',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },

        weight: { type: Sequelize.FLOAT, allowNull: false },
        realWeight: { type: Sequelize.FLOAT, allowNull: false },
        group: { type: Sequelize.ENUM(['A', 'B']), allowNull: true },
        birthDate: { type: Sequelize.DATE, allowNull: false },

        sectionId: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: { model: 'Sections', key: 'id' },
          allowNull: false,
        },
        fighterId: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: { model: 'Fighters', key: 'id' },
          allowNull: false,
        },
        categoryId: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: { model: 'Categories', key: 'id' },
          allowNull: false,
        },
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
    await queryInterface.dropTable('Cards', { transaction });
    await queryInterface.sequelize.query('DROP TYPE "enum_Cards_group"', {
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = { up, down };
