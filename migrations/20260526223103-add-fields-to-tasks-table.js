'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('tasks', 'title', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction });

      await queryInterface.addColumn('tasks', 'description', {
        type: Sequelize.TEXT,
        allowNull: true,
      }, { transaction });

      await queryInterface.addColumn('tasks', 'progress_percentage', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }, { transaction });

      await queryInterface.addColumn('tasks', 'sprint_info', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('tasks', 'title', { transaction });
      await queryInterface.removeColumn('tasks', 'description', { transaction });
      await queryInterface.removeColumn('tasks', 'progress_percentage', { transaction });
      await queryInterface.removeColumn('tasks', 'sprint_info', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
