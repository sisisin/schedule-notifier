'use strict';
module.exports = function(sequelize, DataTypes) {
  var GoogleCredential = sequelize.define('GoogleCredential', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    userId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    googleToken: {
      allowNull: false,
      type: DataTypes.STRING
    },
    googleRefreshToken: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return GoogleCredential;
};