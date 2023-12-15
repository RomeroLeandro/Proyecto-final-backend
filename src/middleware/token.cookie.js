const jwt = require('jsonwebtoken')
const env = require('../config/env/env')

function verifyAccessToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
req.userAuth = false;
    return next();
  }


  jwt.verify(token, env.session.secret, (err, user) => {
    if (err) {
      // En caso de error al verificar el token, redirige a la página de inicio de sesión
      req.userAuth = false;
      return next();
    }
    req.userAuth = true;
    next();
    
  });
}

module.exports = verifyAccessToken