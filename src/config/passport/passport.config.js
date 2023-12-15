const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const env = require("../env/env");
const Cart = require("../../models/cart.model");

// passport.use('login', new LocalStrategy(async (email, password, done) => {
//   try {
//     console.log('Comenzando la estrategia de login en Passport...');

//     const loginResult = await userService.loginUser(email, password);
//     console.log('Resultado del login:', loginResult);

//     if (loginResult.success) {
//       console.log('Autenticación exitosa.');
//       return done(null, loginResult.user);
//     } else {
//       console.log('Fallo en la autenticación:', loginResult.message);
//       return done(null, false, { message: loginResult.message });
//     }
//   } catch (error) {
//     console.error('Error en la estrategia de login:', error);
//     return done(error);
//   }
// }));


// passport.use('register', new LocalStrategy({ passReqToCallback: true }, async (req, email, password, done) => {
//   try {
//     const registrationResult = await userService.registerUser(req.body);
//     if (registrationResult.success) {
//       return done(null, registrationResult.user);
//     } else {
//       return done(null, false, { message: registrationResult.message });
//     }
//   } catch (error) {
//     return done(error);
//   }
// }));

passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {

        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password." });
        }


        const token = jwt.sign({ user }, env.session.secret, {
          expiresIn: "1h",
        });

        return done(null, { user: user.toObject(), token });
      } catch (error) {
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
        const {confirmPassword} = req.body;
        if (password !== confirmPassword) {
          console.log("Passwords don't match");
          return done(null, false, { message: "Passwords don't match" });
        }
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

        const {email} = req.body;
        let role = "user";

        if (email.includes("@coder.com")) {
          role = "admin";
        }

        const newUser = await User.create(body);
        const newCart = await createCart();
        newUser.cart = newCart._id;
        newUser.role = role;
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

// passport.use(
//   "github",
//   new GitHubStrategy(
//     {
//       clientID: `${env.github.clientID}`,
//       clientSecret: `${env.github.clientSecret}`,
//       callbackURL: `${env.github.callbackURL}`,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({
//           $or: [
//             { email: profile._json.email },
//             { email: profile.emails[0].value },
//           ],
//         });
//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser = await User.create({
//           username: profile._json.login,
//           email: profile.emails[0].value,
//         });

//         const newCart = await Cart.create({ products: [] });
//         newUser.cart = newCart._id;
//         await newUser.save();

//         const token = jwt.sign({ newUser }, env.session.secret, {
//           expiresIn: "1h",
//         });
//         return done(null, { newUser, token });
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );



module.exports = passport;
