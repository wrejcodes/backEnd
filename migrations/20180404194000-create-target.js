'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('targets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      target_id: {
        type: Sequelize.INTEGER
      },
      intended_target_gene_id: {
        type: Sequelize.INTEGER
      },
      intended_target_entrez_gene_id: {
        type: Sequelize.INTEGER
      },
      intended_target_official_full_name: {
        type: Sequelize.STRING
      },
      intended_target_gene_name: {
        type: Sequelize.STRING
      },
      intended_target_official_symbol: {
        type: Sequelize.STRING
      },
      intended_target_gene_symbol: {
        type: Sequelize.STRING
      },
      intended_target_description: {
        type: Sequelize.STRING
      },
      intended_target_uniprot_accession_number: {
        type: Sequelize.STRING
      },
      intended_target_organism_id: {
        type: Sequelize.INTEGER
      },
      intended_target_track_status: {
        type: Sequelize.STRING
      },
      technological_target_gene_id: {
        type: Sequelize.INTEGER
      },
      technological_target_entrez_gene_id: {
        type: Sequelize.INTEGER
      },
      technological_target_official_full_name: {
        type: Sequelize.STRING
      },
      technological_target_gene_name: {
        type: Sequelize.STRING
      },
      technological_target_official_symbol: {
        type: Sequelize.STRING
      },
      technological_target_gene_symbol: {
        type: Sequelize.STRING
      },
      technological_target_description: {
        type: Sequelize.STRING
      },
      technological_target_uniprot_accession_number: {
        type: Sequelize.STRING
      },
      technological_target_organism_id: {
        type: Sequelize.INTEGER
      },
      technological_target_track_status: {
        type: Sequelize.STRING
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('targets');
  }
};