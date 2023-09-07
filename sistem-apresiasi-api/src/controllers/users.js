import UsersService from '../services/UsersService.js';

export const postUsersController = async (req, res) => {
  const { npm, name, password, faculty, major } = req.body;

  const usersService = new UsersService();

  try {
    const userId = await usersService.addUser({
      npm,
      name,
      password,
      faculty,
      major,
    });

    res.status(201);
    res.json({
      status: 'success',
      message: 'user berhasil ditambahkan',
      data: {
        userId,
      },
    });
  } catch (error) {
    res.status(400);
    res.json({
      status: 'fail',
      message: error.message,
    });
  }
};
