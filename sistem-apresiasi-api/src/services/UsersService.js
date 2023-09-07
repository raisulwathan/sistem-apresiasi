import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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
      throw new Error('Gagal menambahkan users');
    }

    return users.id;
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
