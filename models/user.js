'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;


module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    username: {
    	type: DataTypes.STRING,
    	validate: {
    		isEmail: true,  
    	},
      unique: true
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM,
      values: ['admin','user']
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,

  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  user.beforeCreate(async (user, options) => {
    const hash = await bcrypt.hash(user.password, saltRounds);
    user.password = hash;
  });
  user.prototype.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };
  user.prototype.getJwt = function(){
    return "Bearer " + jwt.sign({user_id: this.id}, 'Shhhhhhhitsasecrettttt18238*23482348*#$KjaldjfASL', {expiresIn: 18000});
  }
  return user;
};