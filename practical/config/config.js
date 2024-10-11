require("dotenv").config();

const db = {
  development: {
    username: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOSTNAME,
    dialect: process.env.DIALECT,
    pool: {
      max: 5, // Maximum number of connections in the pool
      min: 1, // Minimum number of connections in the pool
      acquire: 6000, // connection ends in 6 seconds
      idle: 3000, //connection ideal before releasing for 3 second
    },
  },
};

module.exports = db;