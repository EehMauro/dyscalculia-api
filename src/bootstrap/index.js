import setupBunyan from './setupBunyan';
import setupDynamoDb from './setupDynamoDb';
import setupRestify from './setupRestify';

export async function setupStateAsync (config) {

  let bunyan = setupBunyan({
    domain: config.DOMAIN,
    level: config.LOG_LEVEL,
    stream: config.LOG_STREAM
  });

  let dynamoClient = setupDynamoDb({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESSKEYID,
    secretAccessKey: config.AWS_SECRETACCESSKEY
  });

  let restify = setupRestify({
    domain: config.DOMAIN,
    port: config.RESTIFY_PORT
  }, bunyan);

  return { bunyan, dynamoClient, restify };

}
