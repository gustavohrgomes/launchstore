const { Pool } = require("pg");

module.exports = new Pool({
  user: "postgres",
  password: "launchstore",
  host: "localhost",
  port: 5432,
  database: "launchstore",
});
