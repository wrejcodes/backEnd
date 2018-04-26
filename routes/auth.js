const express = require('express');
const router = express.Router();
const user = require('../models').user;
const jsonResponse = require('../utils/response');

/**
 * @param {String} req.body.username The username for the user logging in
 * @param {String} req.body.password The password of the user logging in
 * @function This function response to the post with a jwt for successful
 *           log in 400 for sequelize error and 401 for invalid user or pass
 */
router.route('/login')
  .post(async (req, res)=> {
    const options = Object.assign({}, req.body);
    let result;
    try {
      result = await user.findOne({where: {username: options.username}});
    } catch (err) {
      res.status(400).json(new jsonResponse(`Something went wrong: ${err}`));
      return;
    }
    if (result) {
      const correctPassword = await result.verifyPassword(options.password);
      if (correctPassword) {
        const jwt = result.getJwt();
        res.status(200).json(new jsonResponse(null, {token: jwt}));
      } else {
        res.status(401).json(new jsonResponse('Incorrect user or password'));
      }
    } else {
      res.status(401).json(new jsonResponse('Incorrect user or password'));
    }
  });

/**
 * @param {String} req.body.username The username for the user being created
 * @param {String} req.body.password The password of the user being created
 * @param {String} req.body.first_name First name of the user being created
 * @param {String} req.body.last_name Last name of the user being created
 * @function This function responds with if there is an option building the user
 *           in sequelize. Else we respond with 201 and give back the newly
 *           created User object.
 */

router.route('/register')
  .post(async (req, res)=> {
    let writeResult;
    try {
      const options = Object.assign({}, req.body);
      writeResult = await user.build(options).save();
    } catch (err) {
      res.status(500).json(new jsonResponse(err));
      return;
    }

    res.status(201)
      .location(`/user/${writeResult.dataValues.id}`)
      .json(new jsonResponse(null, writeResult.dataValues));
  });
module.exports = router;
