import jwt from 'jsonwebtoken';

export default function({ JWT_SECRET }, userId) {

  return jwt.sign({ userId }, JWT_SECRET);

}