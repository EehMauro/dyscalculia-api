import curry from 'curry';
import handleListQuestions from './handleListQuestions';
import handleCreateForm from './handleCreateForm';
import handleUpdateForm from './handleUpdateForm';
import handleListForms from './handleListForms';
import handleFormsCsv from './handleFormsCsv';
import handleDetailForm from './handleDetailForm';
import handleDoAuthentication from './handleDoAuthentication';
import handleGetSession from './handleGetSession';
import { checkSessionToken, checkFormToken } from '../utils';

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

  restify.put(
    '/forms',
    curry(checkFormToken)(config, state),
    curry(handleUpdateForm)(config, state)
  );

  restify.get(
    '/forms',
    curry(checkSessionToken)(config, state),
    curry(handleListForms)(config, state)
  );

  restify.get(
    '/forms/csv/:type',
    curry(checkSessionToken)(config, state),
    curry(handleFormsCsv)(config, state)
  );

  restify.get(
    '/forms/:id',
    curry(checkSessionToken)(config, state),
    curry(handleDetailForm)(config, state)
  );

  restify.post(
    '/authenticate',
    curry(handleDoAuthentication)(config, state)
  );

  restify.get(
    '/session',
    curry(checkSessionToken)(config, state),
    curry(handleGetSession)(config, state)
  );

  bunyan.info('listening via restify', { RESTIFY_PORT });

  restify.listen(RESTIFY_PORT);

}
