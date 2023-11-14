import { AuthenticationError } from '../exceptions/AuthenticationError.js';
import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) throw new AuthenticationError('required authorization');

  const token = authorization.split(' ')[1];

  jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
    if (err) throw new AuthenticationError('Invalid token');

    req.userId = user.id;
    req.userRole = user.role;
    next();
  });
}
