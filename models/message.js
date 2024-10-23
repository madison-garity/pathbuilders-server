'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});

  // Define associations
  Message.associate = function(models) {
    Message.belongsTo(models.Chat, {
      foreignKey: 'chatId',
      as: 'chat',
    });
  };

  return Message;
};
