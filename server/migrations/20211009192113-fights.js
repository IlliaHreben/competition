/* eslint-disable import/no-commonjs */
const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable('Fights', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

      type        : { type: Sequelize.STRING, allowNull: false },
      orderNumber : { type: Sequelize.INTEGER, allowNull: false },

      firstCardId  : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Cards', key: 'id' }, allowNull: true },
      secondCardId : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Cards', key: 'id' }, allowNull: true },
      winnerId     : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Cards', key: 'id' }, allowNull: true },
      nextFightId  : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Fights', key: 'id' }, allowNull: true },
      categoryId   : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Categories', key: 'id' }, allowNull: false },
      fightSpaceId : { type: Sequelize.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'FightSpaces', key: 'id' }, allowNull: false },

      executedAt : { type: Sequelize.DATE, allowNull: false },
      createdAt  : { type: Sequelize.DATE, allowNull: false },
      deletedAt  : { type: Sequelize.DATE, allowNull: true },
      updatedAt  : { type: Sequelize.DATE, allowNull: false }
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
    await queryInterface.dropTable('Fights', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = { up, down };
