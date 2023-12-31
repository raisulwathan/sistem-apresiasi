import { PrismaClient } from "@prisma/client";
import { InvariantError } from "../exceptions/InvariantError.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { verifyMinimumPoints } from "../utils/index.js";

class SkpiService {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async addSkpi({ mandatoryPoints, organizationPoints, scientificPoints, charityPoints, talentPoints, otherPoints, owner }) {
    verifyMinimumPoints({
      mandatoryPoints,
      organizationPoints,
      scientificPoints,
      talentPoints,
      charityPoints,
      otherPoints,
    });

    const newSkpi = await this._prisma.skpi.create({
      data: {
        mandatoryPoints,
        organizationPoints,
        charityPoints,
        scientificPoints,
        talentPoints,
        otherPoints,
        status: "pending",
        ownerId: owner,
      },
    });

    if (!newSkpi) {
      throw new InvariantError("failed to add SKPI");
    }

    return {
      skpiId: newSkpi.id,
      ownerId: newSkpi.ownerId,
    };
  }

  async getSkpi() {
    const skpi = await this._prisma.skpi.findMany({
      select: {
        id: true,
        status: true,
        owner: {
          select: {
            npm: true,
            name: true,
            faculty: true,
            major: true,
          },
        },
      },
    });

    return skpi;
  }

  async getSkpiByFaculty(faculty) {
    const skpi = await this._prisma.skpi.findMany({
      select: {
        id: true,
        status: true,
        owner: {
          select: {
            name: true,
            npm: true,
            faculty: true,
            major: true,
          },
        },
      },
      where: {
        owner: {
          faculty,
        },
      },
    });

    if (!skpi) {
      throw new NotFoundError("skpi not found");
    }

    return skpi;
  }

  async getSkpiByOwner(owner) {
    const skpi = await this._prisma.skpi.findUnique({
      where: {
        ownerId: owner,
      },
    });

    if (!skpi) {
      throw new NotFoundError("skpi not found");
    }

    return skpi;
  }

  async getSkpiById(id) {
    const skpi = await this._prisma.skpi.findUnique({
      where: {
        id,
      },
      include: {
        owner: {
          select: {
            name: true,
            npm: true,
            faculty: true,
            major: true,
          },
        },
      },
    });

    if (!skpi) {
      throw new NotFoundError("skpi not found");
    }

    return skpi;
  }

  async editStatusSkpiById({ status, id }) {
    await this.getSkpiById(id);

    const editedSkpi = await this._prisma.skpi.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    if (!editedSkpi) {
      throw new InvariantError("failed to edit skpi status");
    }
  }

  async isExistSkpiByOwner(ownerId) {
    const skpi = await this._prisma.skpi.findUnique({
      where: {
        ownerId,
      },
    });

    if (skpi) {
      throw new InvariantError("this users already have skpi data");
    }
  }
}

export default SkpiService;
