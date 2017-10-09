import { generateToken } from '../utils';

export default async function (config, state, req, res, next) {

  res.send(200, { profile: { fullName: 'Administrator' } });

}
