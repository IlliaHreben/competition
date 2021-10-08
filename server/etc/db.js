/* eslint-disable import/no-commonjs */
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
  logging        : process.env.DEBUG === 'true' && console.log,
  dialectOptions : {
    multipleStatements: isTest
  },
  seederStorage          : 'sequelize',
  seederStorageTableName : 'sequelize_data'
};
module.exports = config;
