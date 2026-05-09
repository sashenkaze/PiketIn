'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubmissionPekerjaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubmissionPekerjaan.init({
    submission_id: DataTypes.INTEGER,
    pekerjaan_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SubmissionPekerjaan',
  });
  return SubmissionPekerjaan;
};