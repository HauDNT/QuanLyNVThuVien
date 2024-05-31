require("dotenv").config();
const DOCKER_PORT = process.env.DOCKER_PORT;

module.exports = {
  development: {
    username: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    host: `${process.env.DB_HOST}`,
    dialect: "mysql",
    port: DOCKER_PORT, //Port ánh xạ từ Docker sang Localhost (được định nghĩa trong file mysql.yml)
    charset: "utf8",
    collate: "utf8_general_ci",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
