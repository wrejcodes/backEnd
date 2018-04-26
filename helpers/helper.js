const models = require('../models');
const Op = models.Sequelize.Op;

// Limit default on queries
const DEFAULT_RETURN_LIMIT = 25;
const NUMBERICAL_TYPES = ['DOUBLE PRECISION', 'INTEGER'];

/**
 * Class helper for the models that can preform the following
 */
class Helper {
  /**
   * Sets constants for the model helper
   * @param {String}  name          This is the name of the model to use
   * @param {Array}   defaultFields this is the default SELECT for Queries
   * @param {Integer} defaultLimit  This is default number of entries returned
   *                                (Optional) will use constant if not given
   */
  constructor(name, defaultFields, defaultLimit) {
    this.modelName = name;
    this.defaultFields = (defaultFields) ? defaultFields : [];
    this.defaultLimit = (defaultLimit) ? defaultLimit :
                                               DEFAULT_RETURN_LIMIT;
    // This will track the types of the defualt fields in a parrelel array to
    // defaultFields, determines types using model to be dynamic
    this.defaultFieldTypes = [];
    const attributes = models[this.modelName].rawAttributes;
    for (let i = 0; i < this.defaultFields.length; i += 1) {
      this.defaultFieldTypes.push(attributes[this.defaultFields[i]].type.key);
    }
  }

  /**
   * This will provide a list of all attributes, their types, and if they are
   * a default field for the model (default fields are included in basic query)
   * // TODO: Once the relations are in the model that information should be
   *          added to this functions return
   * @return {Object} describe object returned here
   */
  getAttributeList() {
    const attributes = models[this.modelName].rawAttributes;
    const keys = Object.keys(attributes);
    const arr = [];

    for (let i = 0; i < keys.length; i += 1) {
      arr.push({
        'name': keys[i],
        'type': attributes[keys[i]].type.key,
        'isDefault': this.defaultFields.includes(keys[i]),
      });
    }

    return arr;
  }

  /**
   * Queries using default options
   * @param  {STRING}  queryString The usrs input non spesific database
   * @param  {Object}  options This will set the options for the query
   *                           (Optional)
   * @param  {integer}  options.limit      How many docs to Returns
   * @param  {integer}  options.offset     Where to begin the query
   *                                     (allow user to get next if using limit)
   * @return {Promise}             Will return error or an array with results
   *                               of query
   */
  async basicQuery(queryString, options) {
    return new Promise(async (resolve, reject) => {
      let limit = this.defaultLimit;
      if (options && options.limit !== undefined && options.limit !== null) {
        limit = options.limit;
      }

      let offset = 0;
      if (options && options.offset !== undefined && !isNaN(options.offset)) {
        offset = options.offset;
      }

      let searchParams = [];
      // This will generate the seach query using the types of the fields to
      // search either numerically or string
      for (let i = 0; i < this.defaultFields.length; i += 1) {
        if (NUMBERICAL_TYPES.includes(this.defaultFieldTypes[i])) {
            let queryNum;
            try {
              queryNum = parseFloat(queryString);
            } catch (err) {
              continue;
            }
            searchParams.push({
              [this.defaultFields[i]]: {
                [Op.eq]: queryNum,
              },
            });
          } else {
            searchParams.push({
              [this.defaultFields[i]]: {
                [Op.like]: `%${queryString}%`,
              },
            });
          }
      }

      const results = await models[this.modelName].findAll(
        {
          attributes: this.defaultFields,
          limit,
          offset,
          where: {
            [Op.or]: searchParams,
          },
        }
      );
      resolve(results);
    });
  }
}

module.exports = Helper;
