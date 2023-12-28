import UsersService from '../services/UsersService.js';
import { UsersValidator } from '../validations/users/index.js';

const usersService = new UsersService();

export const postUsersController = async (req, res) => {
  UsersValidator.validatePostUsersPayload(req.body);

  const { npm, name, password, faculty, major, role } = req.body;

  const userId = await usersService.addUser({
    npm,
    name,
    password,
    faculty,
    major,
    role,
  });

  res.status(201);
  res.json({
    status: 'success',
    message: 'New user added',
    data: {
      userId,
    },
  });
};

export const getUserByIdController = async (req, res) => {
  const { id } = req.params;

  const user = await usersService.getUserById(id);

  res.json({
    status: 'success',
    data: {
      user,
    },
  });
};

export const putUsersByIdController = async (req, res) => {
  UsersValidator.validatePutUsersPayload(req.body);

  const { id } = req.params;
  const { role } = req.body;

  await usersService.editUserById(id, { role });

  res.json({
    status: 'success',
    message: 'User role changed',
  });
};
