import jwt from 'jsonwebtoken';
import UsersService from '../services/UsersService.js';
import { AuthenticationsValidator } from '../validations/authentications/index.js';

export const postAuthentication = async (req, res) => {
  AuthenticationsValidator.validateAuthenticationsPayload(req.body);

  const { npm, password } = req.body;

  const userServices = new UsersService();
  const { id, role } = await userServices.verfyUserCredential(npm, password);

  const token = jwt.sign({ id, role }, process.env.TOKEN_SECRET_KEY, {
    expiresIn: process.env.TOKEN_AGE,
  });

  res.status(201);
  res.json({
    status: 'success',
    data: {
      token,
      userId: id,
      role,
    },
  });
};
