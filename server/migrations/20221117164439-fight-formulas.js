/* eslint-disable import/no-commonjs */
const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('FightFormulas', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    sex: { type: Sequelize.ENUM(['man', 'woman']), allowNull: true },
    ageFrom: { type: Sequelize.INTEGER, allowNull: true },
    ageTo: { type: Sequelize.INTEGER, allowNull: true },
    weightFrom: { type: Sequelize.FLOAT, allowNull: true },
    weightTo: { type: Sequelize.FLOAT, allowNull: true },
    weightName: { type: Sequelize.STRING, allowNull: true },
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
      allowNull: true,
    },

    roundCount: { type: Sequelize.INTEGER, allowNull: false },
    roundTime: { type: Sequelize.INTEGER, allowNull: false },
    breakTime: { type: Sequelize.INTEGER, allowNull: false },

    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
    deletedAt: { type: Sequelize.DATE, allowNull: true },
  });
};

const down = async (queryInterface) => {
  await queryInterface.dropTable('FightFormulas');
};

module.exports = { up, down };
