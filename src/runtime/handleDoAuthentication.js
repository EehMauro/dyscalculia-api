import { getItem } from '../persistence';
import { USERS_TABLE } from '../conventions';
import { generateSessionToken } from '../utils';

export default async function (config, state, req, res, next) {

  const { bunyan, dynamoClient } = state;

  bunyan.info('[DO-AUTHENTICATION] received');

  try {

    const { username, password } = req.body;

    let user = await getItem({ TableName: USERS_TABLE, Key: { username } }, dynamoClient);

    if (!user) throw 'user not exists';

    // TODO: change plain password for salt and hashed one
    if (user.password !== password) throw 'password is incorrect';

    bunyan.info('[DO-AUTHENTICATION] success');

    let token = generateSessionToken(config, 'administrator');

    res.send(200, { token });

  } catch (error) {

    bunyan.error('[DO-AUTHENTICATION] error', error);

    res.send(400, { error: 'wrong username or password' });

  }

}
