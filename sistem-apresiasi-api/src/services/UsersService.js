import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { InvariantError } from '../exceptions/InvariantError.js';
import { NotFoundError } from '../exceptions/NotFoundError.js';
import { AuthenticationError } from '../exceptions/AuthenticationError.js';

class UsersService {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async addUser({ npm, name, password, faculty, major, role = 'BASIC' }) {
    await this.isExist(npm);

    const hashedPassword = await bcrypt.hash(password, 10);

    const users = await this._prisma.user.create({
      data: {
        name,
        npm,
        password: hashedPassword,
        faculty,
        major,
        role,
      },
    });

    if (!users) {
      throw new InvariantError('Failed to add users');
    }

    return users.id;
  }

  async getUserById(id) {
    const user = this._prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundError("User's id not found");
    }

    return user;
  }

  async editUserById(id, { role }) {
    const editedUser = await this._prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
    });

    if (!editedUser.id) {
      throw new NotFoundError('failed to edit users. id not found');
    }
  }

  async verfyUserCredential(npm, password) {
    const user = await this._prisma.user.findUnique({
      where: {
        npm,
      },
    });

    if (!user) {
      throw new AuthenticationError(
        'The credentials you provided are incorrect'
      );
    }

    const { id, role, password: hashedPassword } = user;

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError(
        'The credentials you provided are incorrect'
      );
    }

    return { id, role };
  }

  async isExist(npm) {
    const users = await this._prisma.user.findUnique({
      where: { npm },
    });

    if (users) {
      throw new Error('npm is exits');
    }
  }
}

export default UsersService;
