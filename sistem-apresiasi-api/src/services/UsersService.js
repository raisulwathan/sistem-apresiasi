import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { InvariantError } from "../exceptions/InvariantError.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { AuthenticationError } from "../exceptions/AuthenticationError.js";
import axios from "axios";
import { generateStatusActive, generateStatusGraduate } from "../utils/user.utils.js";
import "dotenv/config";

const prisma = new PrismaClient();
const webService = process.env.WEB_SERVICE_USK_URL;
const keys = process.env.WEB_SERVICE_USK_KEY;

export async function create({ npm, name, password, faculty, major, role = "BASIC", email }) {
  await checkUserIsExit(npm);

  const hashedPassword = await bcrypt.hash(password, 10);

  const users = await prisma.user.create({
    data: {
      name,
      npm,
      password: hashedPassword,
      faculty,
      major,
      role,
      email,
      statusActive: "AKTIF",
    },
  });

  if (!users) {
    throw new InvariantError("Failed to add users");
  }

  return users.id;
}

export async function checkUserIsExit(npm) {
  const users = await prisma.user.findUnique({
    where: { npm },
  });

  if (users) {
    throw new Error("npm is exits");
  }
}

export async function getById(id) {
  const user = prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new NotFoundError("User's id not found");
  }

  return user;
}

export async function update(id, role) {
  const editedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });

  if (!editedUser.id) {
    throw new NotFoundError("failed to edit users. id not found");
  }
}

export async function login(npm, password) {
  const user = await prisma.user.findUnique({
    where: {
      npm,
    },
  });

  if (!user) {
    const mhsUsk = await getUserFromWebService(npm);

    const newHashedPassword = await bcrypt.hash("test123", 12);

    const newUser = await prisma.user.create({
      data: {
        email: mhsUsk.email,
        name: mhsUsk.nama,
        npm: mhsUsk.npm,
        password: newHashedPassword,
        role: "BASIC",
        statusActive: generateStatusActive(mhsUsk.status_aktif),
        statusGraduate: generateStatusGraduate(mhsUsk.status_lulus),
        faculty: mhsUsk.fakultas,
        major: mhsUsk.prodi,
        phoneNumber: mhsUsk.no_tlp_mhs,
      },
    });

    const { id, role } = newUser;

    return { id, role };
  } else {
    const { id, role, password: hashedPassword } = user;

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("The credentials you provided are incorrect");
    }
    return { id, role };
  }
}

export async function getUserFromWebService(npm) {
  const mhsUsk = await axios.get(`${webService}/${npm}/key/${keys}`);

  if (!mhsUsk) {
    throw new AuthenticationError("The credentials you provided are incorrect");
  } else {
    return mhsUsk.data;
  }
}
