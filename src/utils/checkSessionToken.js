import jwt from 'jsonwebtoken';

export default function ({ JWT_SECRET }, state, req, res, next) {

  try {

    let token = req.headers.authorization ? req.headers.authorization.split(' ').pop() : (req.query.token ? req.query.token : null);

    if (!token) throw 'missing token';

    let decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) throw 'invalid token';

    req.token = decoded;

    return next();

  } catch (error) {

    res.send(401, { error: 'unauthorized' });

  }

}