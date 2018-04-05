'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('chemicals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DSSTox_Substance_Id: {
        type: Sequelize.STRING
      },
      DSSTox_Structure_Id: {
        type: Sequelize.STRING
      },
      DSSTox_QC_Level: {
        type: Sequelize.STRING
      },
      Substance_Name: {
        type: Sequelize.STRING
      },
      Substance_CASRN: {
        type: Sequelize.STRING
      },
      Substance_Type: {
        type: Sequelize.STRING
      },
      Substance_Note: {
        type: Sequelize.STRING
      },
      Structure_SMILES: {
        type: Sequelize.STRING
      },
      Structure_InChI: {
        type: Sequelize.TEXT
      },
      Structure_InChIKey: {
        type: Sequelize.STRING
      },
      Structure_Formula: {
        type: Sequelize.STRING
      },
      Structure_MolWt: {
        type: Sequelize.DOUBLE
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
    return queryInterface.dropTable('chemicals');
  }
};