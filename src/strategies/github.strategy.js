const passportGithub = require("passport-github2");
const UsersRepository = require("../repositories/user.repository");
const usersRepository = new UsersRepository();
const { generateJWT } = require("../utils/jwt");

const devCallbackURL = "http://localhost:8080/api/session/github-callback";

const prodCallbackURL =
  "https://mern-authentication.herokuapp.com/api/session/github-callback";

const callbackURL =
  process.env.NODE_ENV === "production" ? prodCallbackURL : devCallbackURL;

const githubStrategy = new passportGithub(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await usersRepository.getUserByFilter({
        name: profile.username,
      });
      if (!user) {
        let data = {
          name: profile.username,
          last_name: "",
          email: profile._json.email,
          age: 18,
          password: "",
        };
        const newUser = await usersRepository.createUser(data);
        const token = generateJWT({
          userId: newUser._id,
          role: newUser.role,
          name: newUser.name,
          cart: newUser.cart,
          age: newUser.age,
        });
        newUser.token = token;
        return done(null, newUser);
      } else {
        const token = generateJWT({
          userId: user._id,
          role: user.role,
          name: user.name,
          cart: user.cart,
          age: user.age,
        });
        user.token = token;
        return done(null, user);
      }
    } catch (error) {
      return done(error);
    }
  }
);

module.exports = githubStrategy;
