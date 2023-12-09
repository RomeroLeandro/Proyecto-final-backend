const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const env = require("../env/env");
const Cart = require("../../models/cart.model");

passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        console.log(
          "Login intent for email:",
          email
        );

        const user = await User.findOne({ email });
        if (!user) {
          console.log("Email not found:", email);
          return done(null, false, { message: "Incorrect username." });
        }

        console.log("User found:", user);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.log("Incorrect password for user:", user);
          return done(null, false, { message: "Incorrect password." });
        }

        console.log("Valid password for the user:", user);

        const token = jwt.sign({ user }, env.session.secret, {
          expiresIn: "1h",
        });
        console.log("Token generated for the user:", user);

        return done(null, { user: user.toObject(), token });
      } catch (error) {
        console.error("Error during login:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({ email: username });
        if (user) {
          console.log("Existing user");
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
        };

        const newUser = await User.create(body);
        const newCart = await createCart();
        newUser.cart = newCart._id;
        await newUser.save();
        const token = jwt.sign({ newUser }, env.session.secret, {
          expiresIn: "1h",
        });
        return done(null, { newUser, token });
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.use(
  "github",
  new GitHubStrategy(
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
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
