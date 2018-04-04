'use strict';
module.exports = (sequelize, DataTypes) => {
  var chemical = sequelize.define('chemical', {
    DSSTox_Substance_Id: DataTypes.STRING,
    DSSTox_Structure_Id: DataTypes.STRING,
    DSSTox_QC_Level: DataTypes.STRING,
    Substance_Name: DataTypes.STRING,
    Substance_CASRN: DataTypes.STRING,
    Substance_Type: DataTypes.STRING,
    Substance_Note: DataTypes.STRING,
    Structure_SMILES: DataTypes.STRING,
    Structure_InChI: DataTypes.TEXT,
    Structure_InChIKey: DataTypes.STRING,
    Structure_Formula: DataTypes.STRING,
    Structure_MolWt: DataTypes.DOUBLE
  }, {});
  chemical.associate = function(models) {
    // associations can be defined here
  };
  return chemical;
};