import dotenv from 'dotenv';

import { setupStateAsync } from './bootstrap';
import { startGatewayAsync } from './runtime';

async function start () {

  dotenv.load({ silent: true });

  const config = {
    DOMAIN: 'queso-api-v3',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    LOG_STREAM: process.stdout,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID,
    AWS_SECRETACCESSKEY: process.env.AWS_SECRETACCESSKEY,
    RESTIFY_PORT: process.env.RESTIFY_PORT,
    JWT_SECRET: process.env.JWT_SECRET
  };

  let state = await setupStateAsync(config);

  await startGatewayAsync(config, state);

}

start().catch((err) => {
  console.error(err)
  process.exit();
});
