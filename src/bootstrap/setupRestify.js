import restify from 'restify';
import restifyCorsMiddleware from 'restify-cors-middleware';

const cors = restifyCorsMiddleware({
  origins: ['*'],
  allowHeaders: ['Authorization']
});

export default function (config, bunyan) {

  let { port, domain } = config;

  let server = restify.createServer({ name: domain });

  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser());
  server.pre(cors.preflight);
  server.use(cors.actual);

  return server;

}
