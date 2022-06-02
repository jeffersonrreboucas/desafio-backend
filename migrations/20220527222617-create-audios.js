'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Audios', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDv4,
        allowNull: false,
        primaryKey: true
      },
      url: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      postId: {
        type: Sequelize.UUID,
        // defaultValue: Sequelize.UUIDv4,
        allowNull: false,
        references: {
          model: {
            tableName: "Posts",
          },
          key: "id",
        },
      },
      userId: {
        type: Sequelize.UUID,
        // defaultValue: Sequelize.UUIDv4,
        allowNull: false,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Audios');
  }
};