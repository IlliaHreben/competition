import db from './db.js';

console.log(`${db.dialect}://${db.username}:${db.password}@${db.host}:5432/${db.database}`);
