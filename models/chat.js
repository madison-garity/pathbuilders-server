'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thread_id: {
      type: DataTypes.STRING,
    },
    isFavorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {});

  // Define associations
  Chat.associate = function(models) {
    Chat.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Chat.hasMany(models.Message, {
      foreignKey: 'chatId',
      as: 'messages',
      onDelete: 'CASCADE'
    });
  };

  return Chat;
};
