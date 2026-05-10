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
      Submission.belongsTo(models.User, { foreignKey: 'user_id' });
      Submission.hasMany(models.SubmissionPekerjaan, { foreignKey: 'submission_id' });
      Submission.belongsToMany(models.JenisPekerjaan, {
        through: models.SubmissionPekerjaan,
        foreignKey: 'submission_id',
        otherKey: 'pekerjaan_id'
      });
    }
  }
  Submission.init({
    user_id: DataTypes.INTEGER,
    tanggal_piket: DataTypes.DATEONLY,
    status_piket: DataTypes.ENUM('Piket', 'Tidak Piket'),
    kondisi: DataTypes.ENUM('Bersih dan Rapi', 'Bersih', 'Kurang'),
    catatan: DataTypes.TEXT,
    foto_sebelum: DataTypes.STRING,
    foto_sesudah: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Pending', 'Accepted', 'Declined'),
      defaultValue: 'Pending',
    },
    alasan_decline: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Submission',
  });
  return Submission;
};