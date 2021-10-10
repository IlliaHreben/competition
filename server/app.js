/* eslint import/imports-first:0  import/newline-after-import:0 */

import express              from 'express';
import { app as appConfig } from './config.js';
import middlewares          from './lib/middlewares.js';
import router               from './lib/router.js';

import './lib/registerValidationRules';

// Init app
const app = express();

app.use(middlewares.json);
app.use(middlewares.urlencoded);
app.use(middlewares.cors);
app.use(middlewares.arrays);
app.use('/api/v1', router);

const isTest = process.env.MODE === 'test';

let server = null;

if (!isTest) {
  server = app.listen(appConfig.port, () => {
    const { port } = server.address();

    console.log(`APP STARTING AT PORT ${port}`);
  });
}

export default app;

// export function onShutdown () {
//   if (server) {
//     return new Promise((res) => {
//       server.close(res);
//     });
//   }
// }
