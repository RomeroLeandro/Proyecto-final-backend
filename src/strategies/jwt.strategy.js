const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const extractHeaders = (req) => {
  const cookies =
    req.headers && req.headers.cookie ? req.headers.cookie.split(";") : [];
  let tokenValue;

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    if (key.trim() === "token") {
      tokenValue = value;
    }
  });

  return tokenValue;
};

const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromExtractors([extractHeaders]),
    secretOrKey: process.env.JWT_SECRET,
  },
  (jwtPayload, cb) => {
    try {
      done(null, jwtPayload);
    } catch (error) {
      done(error);
    }
  }
);

module.exports = { jwtStrategy, extractHeaders };
