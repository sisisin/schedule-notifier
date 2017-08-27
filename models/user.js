'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    twitterToken: {
      allowNull: false,
      type: DataTypes.STRING
    },
    twitterTokenSecret: {
      allowNull: false,
      type: DataTypes.STRING
    },
    notificationTime: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    mentionTarget: {
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
  return User;
};