const express = require('express');
const sessionViewRouter = express.Router();
const verifyAccessToken = require('../middleware/token.cookie');

sessionViewRouter.get('/login', (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
      return res.redirect('/products');
    }
    res.render('login');
  });
  
  sessionViewRouter.get('/register', (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
      return res.redirect('/products');
    }
    res.render('register');
  });

module.exports = sessionViewRouter;