import { PrismaClient } from '@prisma/client';
import { getBobotSKP, loadData } from '../utils/index.js';

const _FIELD_ACTIVITY = {
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
    year,
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
        years: year,
        locations: location,
        points: point,
        fileUrl,
        ownerId: owner,
      },
    });

    if (!newActivity) {
      throw new Error('Gagal Menambahkan kegiatan');
    }

    return {
      activityId: newActivity.id,
      ownerId: newActivity.ownerId,
    };
  }
}

export default ActivitiesService;
