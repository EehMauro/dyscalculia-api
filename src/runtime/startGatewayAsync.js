import curry from 'curry';
import handleListQuestions from './handleListQuestions';
import handleCreateForm from './handleCreateForm';
import handleListForms from './handleListForms';
import handleDetailForm from './handleDetailForm';
import handleDoAuthentication from './handleDoAuthentication';
import handleGetSession from './handleGetSession';
import { checkSession } from '../utils';

export default async function (config, state) {

  let { RESTIFY_PORT } = config;
  let { restify, bunyan } = state;

  restify.get(
    '/questions',
    curry(handleListQuestions)(config, state)
  );

  restify.post(
    '/forms',
    curry(handleCreateForm)(config, state)
  );

  restify.get(
    '/forms',
    curry(checkSession)(config, state),
    curry(handleListForms)(config, state)
  );

  restify.get(
    '/forms/:id',
    curry(checkSession)(config, state),
    curry(handleDetailForm)(config, state)
  );

  restify.post(
    '/authenticate',
    curry(handleDoAuthentication)(config, state)
  );

  restify.get(
    '/session',
    curry(checkSession)(config, state),
    curry(handleGetSession)(config, state)
  );

  bunyan.info('listening via restify', { RESTIFY_PORT });

  restify.listen(RESTIFY_PORT);

}
