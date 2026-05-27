'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('banners', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      button_text: {
        type: Sequelize.STRING,
        allowNull: true
      },
      button_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      style: {
        type: Sequelize.STRING,
        defaultValue: 'gradient'
      },
      desktop_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mobile_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('banners');
  }
};
