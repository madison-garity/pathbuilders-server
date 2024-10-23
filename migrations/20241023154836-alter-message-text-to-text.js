'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Messages', 'text', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Messages', 'text', {
      type: Sequelize.STRING(255),  // Revert back to the original STRING type with 255 length
      allowNull: false,
    });
  }
};
