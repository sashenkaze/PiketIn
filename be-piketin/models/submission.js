'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Submission.init({
    user_id: DataTypes.INTEGER,
    tanggal_piket: DataTypes.DATEONLY,
    status_piket: DataTypes.ENUM,
    kondisi: DataTypes.ENUM,
    catatan: DataTypes.TEXT,
    foto_sebelum: DataTypes.STRING,
    foto_sesudah: DataTypes.STRING,
    status: DataTypes.ENUM,
    alasan_decline: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Submission',
  });
  return Submission;
};