'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JenisPekerjaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JenisPekerjaan.init({
    nama_pekerjaan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'JenisPekerjaan',
  });
  return JenisPekerjaan;
};