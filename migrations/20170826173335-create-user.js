'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      twitterToken: {
        allowNull: false,
        type: Sequelize.STRING
      },
      twitterTokenSecret: {
        allowNull: false,
        type: Sequelize.STRING
      },
      notificationTime: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      mentionTarget: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};