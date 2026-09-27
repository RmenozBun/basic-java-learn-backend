const config = {
  app: {
    subPath: process.env.SUB_PATH || "/api",
    port: process.env.PORT || 4000,
    env: process.env.NODE_ENV || "local",
  },
  db: {
    mongoDB: {
      uri: process.env.MONGODB_URI || "",
      host: process.env.DB_HOST_MONGO || "localhost:27017",
      database: process.env.DB_NAME_MONGO || "java_learn_web",
      username: process.env.DB_USER_MONGO || "",
      password: process.env.DB_PASSWORD_MONGO || "",
    },
  },
};

export default config;
