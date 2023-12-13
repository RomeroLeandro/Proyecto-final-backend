const User = require('../models/user.model');

const getUserByEmail = async (email) => {
    return await User.findById(email);
}

const createUser = async (userData) => {
    return await User.create(userData);
}

module.exports = {
    getUserByEmail,
    createUser
}