const isTest = process.env.NODE_ENV === 'test';

const pool = {
  max : 10,
  min : 0
};

const credentials = {
  password : process.env.DB_PASSWORD,
  username : process.env.DB_USER,
  database : process.env.DB_NAME,
  host     : process.env.DB_HOST
};

const config = {
  ...credentials,
  dialect        : 'postgres',
  pool,
  logging        : process.env.DEBUG && console.log,
  dialectOptions : {
    multipleStatements: isTest
  }
};

module.exports = config;
