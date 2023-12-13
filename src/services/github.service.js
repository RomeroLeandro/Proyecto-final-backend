const GitHubStrategy = require("passport-github2").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const env = require("../config/env/env");
const Cart = require("../models/cart.model");

const githubStrategy = new GitHubStrategy(
    {
        clientID: `${env.github.clientID}`,
        clientSecret: `${env.github.clientSecret}`,
        callbackURL: `${env.github.callbackURL}`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await User.findOne({
                $or: [
                { email: profile._json.email },
                { email: profile.emails[0].value },
                ],
            });
            if (existingUser) {
                return done(null, existingUser);
            }
        
            const newUser = await User.create({
                username: profile._json.login,
                email: profile.emails[0].value,
            });
        
            const newCart = await Cart.create({ products: [] });
            newUser.cart = newCart._id;
            await newUser.save();
        
            const token = jwt.sign({ newUser }, env.session.secret, {
                expiresIn: "1h",
            });
            return done(null, { newUser, token });
        } catch (error) {
            return done(error);
        }

    }
);

module.exports = githubStrategy;