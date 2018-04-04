'use strict';
module.exports = (sequelize, DataTypes) => {
  var target = sequelize.define('target', {
    target_id: DataTypes.INTEGER,
    intended_target_gene_id: DataTypes.INTEGER,
    intended_target_entrez_gene_id: DataTypes.INTEGER,
    intended_target_official_full_name: DataTypes.STRING,
    intended_target_gene_name: DataTypes.STRING,
    intended_target_official_symbol: DataTypes.STRING,
    intended_target_gene_symbol: DataTypes.STRING,
    intended_target_description: DataTypes.STRING,
    intended_target_uniprot_accession_number: DataTypes.STRING,
    intended_target_organism_id: DataTypes.INTEGER,
    intended_target_track_status: DataTypes.STRING,
    technological_target_gene_id: DataTypes.INTEGER,
    technological_target_entrez_gene_id: DataTypes.INTEGER,
    technological_target_official_full_name: DataTypes.STRING,
    technological_target_gene_name: DataTypes.STRING,
    technological_target_official_symbol: DataTypes.STRING,
    technological_target_gene_symbol: DataTypes.STRING,
    technological_target_description: DataTypes.STRING,
    technological_target_uniprot_accession_number: DataTypes.STRING,
    technological_target_organism_id: DataTypes.INTEGER,
    technological_target_track_status: DataTypes.STRING
  }, {});
  target.associate = function(models) {
    // associations can be defined here
  };
  return target;
};