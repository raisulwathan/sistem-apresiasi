import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { InvariantError } from '../exceptions/InvariantError.js';
import { NotFoundError } from '../exceptions/NotFoundError.js';

class UsersService {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async addUser({ npm, name, password, faculty, major }) {
    await this.isExist(npm);

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'BASIC';

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
      throw new InvariantError('Gagal menambahkan users');
    }

    return users.id;
  }

  async getUser() {
    const users = await this._prisma.user.findMany();

    return users;
  }

  async getUserById(id) {
    const user = await this._prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new InvariantError('User tidak ditemukan');
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
      throw new NotFoundError('gagal mengubah users. id tidak ditemukan');
    }
  }

  async isExist(npm) {
    const users = await this._prisma.user.findUnique({
      where: { npm },
    });

    if (users) {
      throw new Error('npm sudah terdaftar');
    }
  }
}

export default UsersService;
