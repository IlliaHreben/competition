/* eslint-disable import/no-commonjs */
import { createRequire }         from 'module';
const require = createRequire(import.meta.url);

export const categories = require('./categories.json');
