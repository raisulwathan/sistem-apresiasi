import { PrismaClient } from '@prisma/client';
import { getBobotSKP, loadData } from '../utils/index.js';
import { InvariantError } from '../exceptions/InvariantError.js';
import { NotFoundError } from '../exceptions/NotFoundError.js';
import { AuthorizationError } from '../exceptions/AuthorizationError.js';

const _FIELD_ACTIVITY = {
  kegiatanWajib: 'Kegiatan Wajib',
  bidangOrganisasi: 'Bidang Organisasi Kemahasiswaan dan Kepemimpinan',
  bidangKeilmuan:
    'Bidang Penalaran dan Keilmuan, Penyelarasan dan Pengembangan Karir',
  bidangMinatBakat:
    'Bidang Minat, Bakat, Mental Spritiual Kebangsaan dan Kewirausahaan',
  bidangBaktiSosial: 'Bidang Kepedulian Sosial',
  bidangLainnya: 'Bidang Lainnya',
};

class ActivitiesService {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async addActivity({
    name,
    fieldActivity,
    activity,
    level,
    possitionAchievement,
    location,
    fileUrl,
    owner,
  }) {
    const path = `./src/data/${fieldActivity}.json`;
    const data = loadData(path);

    const point = getBobotSKP(data, { activity, level, possitionAchievement });
    const newFieldActivity = _FIELD_ACTIVITY[fieldActivity];

    const newActivity = await this._prisma.activity.create({
      data: {
        name,
        fieldsActivity: newFieldActivity,
        activity,
        levels: level,
        possitions_achievements: possitionAchievement,
        locations: location,
        points: point,
        fileUrl,
        ownerId: owner,
      },
    });

    if (!newActivity) {
      throw new InvariantError('Gagal Menambahkan kegiatan');
    }

    return {
      activityId: newActivity.id,
      ownerId: newActivity.ownerId,
    };
  }

  async getActivities(owner) {
    const activites = await this._prisma.activity.findMany({
      where: {
        ownerId: owner,
      },
    });

    if (!activites) {
      throw new NotFoundError('Kegiatan tidak ditemukan');
    }

    return activites;
  }

  async getActivitiesByFaculty(faculty) {
    const activities = await this._prisma.activity.findMany({
      where: {
        owner: {
          faculty,
        },
      },
    });

    if (!activities) {
      throw new NotFoundError('Kegiatan tidak ditemukan');
    }

    return activities;
  }

  async getActivityById(id) {
    const activity = await this._prisma.activity.findUnique({
      where: {
        id,
      },
    });

    if (!activity) {
      throw new NotFoundError('id kegiatan tidak ditemukan');
    }

    return activity;
  }

  async getValidActivityByFaculty(faculty, status) {
    const activities = await this.getActivityByFaculty(faculty);

    if (!activity) {
      throw new NotFoundError('Kegiatan tidak ditemukan');
    }

    const validActivities = activities.filter(
      (activity) => activity.status === status
    );

    if (!validActivities) {
      throw new NotFoundError('Tidak ada kegiatan yang valid');
    }

    return validActivities;
  }

  async editStatusActivityById(id, { status, message }) {
    await this.getActivityById(id);

    const activity = await this._prisma.activity.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    if (!activity) {
      throw new InvariantError('gagal validasi kegiatan');
    }

    if (activity.status === 'rejected') {
      await this._prisma.rejectedActivity.create({
        data: {
          message,
          activityId: activity.id,
          ownerId: activity.ownerId,
        },
      });
    }
  }

  async getRejectedActivities(owner) {
    const activities = await this._prisma.rejectedActivity.findMany({
      where: {
        ownerId: owner,
      },
    });

    if (!activities) {
      throw new NotFoundError('Kegiatan yang ditolak tidak temukan');
    }

    return activities;
  }

  async getRejectedActivityById(id) {
    const activity = await this._prisma.rejectedActivity.findUnique({
      where: {
        id,
      },
    });

    if (!activity) {
      throw new NotFoundError('Kegiatan tidak ditemukan');
    }

    return activity;
  }

  async verifyActivitiyOwner(id, owner) {
    const activity = await this._prisma.activity.findUnique({
      where: {
        id,
      },
    });

    if (!activity) {
      throw new NotFoundError('id kegiatan tidak ditemukan');
    }

    if (owner !== activity.ownerId) {
      throw new AuthorizationError('user tidak berhak mengakses resources ini');
    }
  }
}

export default ActivitiesService;
