'use strict';
module.exports = (sequelize, DataTypes) => {
  var target_id = sequelize.define('target_id', {
    aeid: DataTypes.INTEGER,
    target_id: DataTypes.INTEGER
  }, {});
  target_id.associate = function(models) {
    // associations can be defined here
  };
  return target_id;
};