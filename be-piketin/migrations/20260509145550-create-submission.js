'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Submissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        type: Sequelize.BIGINT
      },
      tanggal_piket: {
        type: Sequelize.DATEONLY
      },
      status_piket: {
        type: Sequelize.ENUM('Piket', 'Tidak Piket')
      },
      kondisi: {
        type: Sequelize.ENUM('Bersih dan Rapi', 'Bersih', 'Kurang')
      },
      catatan: {
        type: Sequelize.TEXT
      },
      foto_sebelum: {
        type: Sequelize.STRING
      },
      foto_sesudah: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Accepted', 'Declined')
      },
      alasan_decline: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Submissions');
  }
};