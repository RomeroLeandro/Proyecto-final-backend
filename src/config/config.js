const config = () => {
  return {
    mongoUser: process.env.MONGO_DATABASE_USER,
    mongoPassword: process.env.MONGO_DATABASE_PASSWORD,
    mongoName: process.env.MONGO_DATABASE_NAME,
    mongoHost: process.env.MONGO_DATABASE_HOST,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
    clientGithubId: process.env.GITHUB_CLIENT_ID,
    clientGithubSecret: process.env.GITHUB_CLIENT_SECRET,
    privateKey: process.env.PRIVATE_KEY,
    jwtKey: process.env.JWT_KEY,
    adminUser: process.env.ADMIN_USER,
    AdminPassword: process.env.ADMIN_PASSWORD,
    AdminId: process.env.ADMIN_ID,
    stripeKey: process.env.STRIPE_KEY,
    port: process.env.PORT,
    environment: process.env.ENVIRONMENT,
  };
};

module.exports = config;
