import jwt from 'jsonwebtoken';

export default function({ JWT_SECRET }, email) {

  return jwt.sign({ email }, JWT_SECRET);

}