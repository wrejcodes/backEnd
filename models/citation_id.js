'use strict';
module.exports = (sequelize, DataTypes) => {
  var citation_id = sequelize.define('citation_id', {
    aeid: DataTypes.INTEGER,
    citation_id: DataTypes.INTEGER,
    pmid: DataTypes.INTEGER
  }, {});
  citation_id.associate = function(models) {
    // associations can be defined here
  };
  return citation_id;
};