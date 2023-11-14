import { PrismaClient } from '@prisma/client';
import { InvariantError } from '../exceptions/InvariantError';
import { NotFoundError } from '../exceptions/NotFoundError';

class SkpiService {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async addSkpi(
    {
      mandatoryPoints,
      organizationPoints,
      scientificPoints,
      charityPoints,
      talentPoints,
      otherPoints,
    },
    owner
  ) {
    const newSkpi = await this._prisma.skpi.create({
      data: {
        mandatoryPoints,
        organizationPoints,
        charityPoints,
        scientificPoints,
        talentPoints,
        otherPoints,
        status: 'pending',
        ownerId: owner,
      },
    });

    if (!newSkpi) {
      throw new InvariantError('failed to add SKPI');
    }

    return {
      skpiId: newSkpi.id,
      ownerId: newSkpi.ownerId,
    };
  }

  async getSkpi() {
    const skpi = await this._prisma.skpi.findMany({
      select: {
        id,
        status,
      },
      include: {
        owner: {
          select: {
            npm,
            name,
          },
        },
      },
    });

    return skpi;
  }

  async getSkpiByFaculty(faculty) {
    const skpi = await this._prisma.skpi.findMany({
      where: {
        owner: {
          faculty,
        },
      },
      select: {
        id,
        status,
      },
      include: {
        owner: {
          select: {
            npm,
            name,
          },
        },
      },
    });

    if (!skpi) {
      throw new NotFoundError('skpi not found');
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
      throw new NotFoundError('skpi not found');
    }

    return skpi;
  }

  async getSkpiById(id) {
    const skpi = await this._prisma.skpi.findUnique({
      where: {
        id,
      },
    });

    if (!skpi) {
      throw new NotFoundError('skpi not found');
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
      throw new InvariantError('failed to edit skpi status');
    }
  }

  async isExistSkpiByOwner(ownerId) {
    const skpi = await this._prisma.skpi.findUnique({
      where: {
        ownerId,
      },
    });

    if (skpi) {
      throw new InvariantError('this users already have skpi data');
    }
  }
}

export default SkpiService;
