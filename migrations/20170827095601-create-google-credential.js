'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('GoogleCredentials', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      userId: {
        allowNull: false,
        references:{
          model: 'Users',
          key: 'id'
        },
        type: Sequelize.STRING
      },
      googleToken: {
        allowNull: false,
        type: Sequelize.STRING
      },
      googleRefreshToken: {
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
    return queryInterface.dropTable('GoogleCredentials');
  }
};