const userService = require('../services/user.service');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const loginResult = await userService.login(email, password);

        if (!loginResult.success) {
            res.cookie('token', loginResult.token, { httpOnly: true });
            res.json({user: loginResult.user, token: loginResult.token});
        } else {
            res.status(401).json({message: loginResult.message});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const register = async (req, res) => {
    const registrationResult = await userService.registerUser(req.body);
  
    if (registrationResult.success) {
      res.cookie('token', registrationResult.token, { httpOnly: true });
      res.json({ user: registrationResult.user, token: registrationResult.token });
    } else {
      res.status(400).json({ message: registrationResult.message });
    }
  };

  module.exports = {
    login,
    register
  };