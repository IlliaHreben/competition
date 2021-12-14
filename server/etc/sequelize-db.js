import db from './db.cjs';

console.log(`${db.dialect}://${db.username}:${db.password}@${db.host}:5432/${db.database}`);
