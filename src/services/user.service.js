const userDao = require('../dao/user.dao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env/env');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

passport.use('login', new LocalStrategy( async (email, password, done) => {
    try {
        const user = await userDao.getUserByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        const token = jwt.sign({ user }, env.session.secret, {
            expiresIn: '1h'
        });

        return done(null, { user: user.toObject(), token });
    } catch (error) {
        return done(error);
    }
}));

const loginUser = (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(401).json({ message: info.message || 'Unauthorized' });
        }
        const token = user.token;

        res.cookie('token', token, {
            httpOnly: true
        });

        return res.json({ user: user.user, token: user.token });
    })(req, res, next);
}

passport.use('register', new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
    try {
        const user = await userDao.getUserByEmail(username);
        if (user) {
            console.log('Existing user');
            return done(null, false);
        }

        const body = req.body;
        body.password = await bcrypt.hash(password, 10);

        const createCart = async () => {
            try {
                const newCart = await Cart.create({ products: [] });
                return newCart;
            } catch (error) {
                throw error;
            }
        }

        const newCart = await createCart();
        body.cart = newCart._id;

        const newUser = await userDao.createUser(body);

        const token = jwt.sign({ user: newUser }, env.session.secret, {
            expiresIn: '1h'
        });

        return done(null, { newUser: newUser.toObject(), token });
    } catch (error) {
        return done(error);
    }
}));

const registerUser = async (userData) => {
    try {
      const existingUser = await userDao.getUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, message: 'User already exists.' };
      }
  
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
  
      const newUser = await userDao.createUser(userData);
      const token = jwt.sign({ newUser }, env.session.secret, { expiresIn: '1h' });
      return { success: true, user: newUser, token };
    } catch (error) {
      // Manejo de errores en el registro de usuario
      return { success: false, message: 'Error while registering user.' };
    }
  };

module.exports = {
    loginUser,
    registerUser
}