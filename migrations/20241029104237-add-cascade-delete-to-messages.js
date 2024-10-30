'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, remove the current foreign key constraint on `chatId`
    await queryInterface.removeConstraint('Messages', 'Messages_chatId_fkey'); // Replace with actual constraint name if different

    // Then, re-add the foreign key constraint with cascade delete
    await queryInterface.addConstraint('Messages', {
      fields: ['chatId'],
      type: 'foreign key',
      name: 'Messages_chatId_fkey', // Name of the constraint
      references: {
        table: 'Chats',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the new cascade constraint
    await queryInterface.removeConstraint('Messages', 'Messages_chatId_fkey');

    // Optionally, re-add the original constraint without cascade if needed
    await queryInterface.addConstraint('Messages', {
      fields: ['chatId'],
      type: 'foreign key',
      name: 'Messages_chatId_fkey', // Use the original constraint name
      references: {
        table: 'Chats',
        field: 'id',
      },
      onDelete: 'NO ACTION', // Or set to restrict or nullify as per original constraint
    });
  },
};
