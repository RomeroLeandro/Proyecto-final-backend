const passportGithub = require("passport");
const githubStrategy = require("../services/github.service");

passportGithub.use("github", githubStrategy);

module.exports = passportGithub.authenticate("github", { session: false });