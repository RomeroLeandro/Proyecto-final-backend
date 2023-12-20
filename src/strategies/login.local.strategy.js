const passportLocal = require("passport-local");
const UsersRepository = require("../repositories/user.repository");
const usersRepository = new UsersRepository();
const { isValidPassword } = require("../utils/password.hash");
const { generateJWT } = require("../utils/jwt");

const LocalStrategy = passportLocal.Strategy;

const hardcodedUser = {
  userId: process.env.ADMIN_ID,
  name: "Usuario",
  last_name: "Admin",
  email: process.env.ADMIN_USER,
  password: process.env.ADMIN_PASSWORD,
  role: "ADMIN",
  age: 30,
};

const loginLocalStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      if (
        hardcodedUser.email === email &&
        hardcodedUser.password === password
      ) {
        const token = generateJWT({
          userId: hardcodedUser.userId,
          role: hardcodedUser.role,
          name: hardcodedUser.name,
          last_name: hardcodedUser.last_name,
          email: hardcodedUser.email,
          age: hardcodedUser.age,
        });
        hardcodedUser.token = token;
        return done(null, hardcodedUser);
      }

      let user = await usersRepository.getUserByFilter({ email });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      if (!isValidPassword(password, user.password)) {
        return done(null, false, { message: "Password is not valid" });
      }

      await usersRepository.updateUserLastConnection(user);
      delete user.password;

      const token = generateJWT({
        userId: user.userId,
        role: user.role,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
      });
      user.token = token;
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

module.exports = loginLocalStrategy;
