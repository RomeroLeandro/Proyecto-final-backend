const passportLocal = require("passport-local");
const UsersRepository = require("../repositories/user.repository");
const usersRepository = new UsersRepository();

const LocalStrategy = passportLocal.Strategy;

const registerLocalStrategy = new LocalStrategy(
  { passReqToCallback: true, usernameField: "email" },
  async (req, email, password, done) => {
    const { name, last_name, age, email } = req.body;

    try {
      let user = await usersRepository.getUserByFilter({ email: username });

      if (user) {
        return done(null, false, { message: "Email already exists" });
      }

      if (!name || !last_name || !age || !email) {
        return done(null, false, { message: "All fields are required" });
      }

      let newUser = { name, last_name, age, email, password };

      let result = await usersRepository.createUser(newUser);

      return done(null, result);
    } catch (error) {
      return done(error);
    }
  }
);

module.exports = registerLocalStrategy;
