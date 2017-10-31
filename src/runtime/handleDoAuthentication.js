import { generateSessionToken } from '../utils';

export default async function (config, state, req, res, next) {

  const { bunyan } = state;

  bunyan.info('[DO-AUTHENTICATION] received');

  try {

    const { username, password } = req.body;

    if (username !== 'admin') throw 'invalid user';

    if (password !== 'discalculia17') throw 'invalid password';

    bunyan.info('[DO-AUTHENTICATION] success');

    let token = generateSessionToken(config, 'administrator');

    res.send(200, { token });

  } catch (error) {

    bunyan.error('[DO-AUTHENTICATION] error', error);

    res.send(400, { error: 'wrong username or password' });

  }

}
