const jwt = require('jsonwebtoken')
const env = require('../config/env/env')

function verifyAccessToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    // Si no hay token, redirige a la página de inicio de sesión
    return res.redirect('/session/login');
  }

  jwt.verify(token, env.session.secret, (err, user) => {
    if (err) {
      // En caso de error al verificar el token, redirige a la página de inicio de sesión
      return res.redirect('/session/login');
    }
    
    // Si el token es válido, redirige al usuario a la página de productos
    return res.redirect('/products');
  });
}

module.exports = verifyAccessToken