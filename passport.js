const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const user = require('./models').user;

module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = 'Shhhhhhhitsasecrettttt18238*23482348*#$KjaldjfASL';

  passport.use(new JwtStrategy(opts,
   async function(jwtPayload, done) {
    const instance = await user.findById(jwtPayload.user_id);
    if (!instance) {
      return done(new Error('couldn\'t find user with that token'), false);
    }
    return done(null, instance);
   }
  ));
};
