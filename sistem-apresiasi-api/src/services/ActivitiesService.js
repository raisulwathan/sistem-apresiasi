import { PrismaClient } from "@prisma/client";
import { getBobotSKP, loadData } from "../utils/index.js";
import { InvariantError } from "../exceptions/InvariantError.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { AuthorizationError } from "../exceptions/AuthorizationError.js";

const _FIELD_ACTIVITY = {
  kegiatanWajib: "Kegiatan Wajib",
  bidangOrganisasi: "Bidang Organisasi Kemahasiswaan dan Kepemimpinan",
  bidangKeilmuan: "Bidang Penalaran dan Keilmuan, Penyelarasan dan Pengembangan Karir",
  bidangMinatBakat: "Bidang Minat, Bakat, Mental Spritiual Kebangsaan dan Kewirausahaan",
  bidangBaktiSosial: "Bidang Kepedulian Sosial",
  bidangLainnya: "Bidang Lainnya",
};

class ActivitiesService {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async addActivity({ name, fieldActivity, activity, level, possitionAchievement, location, years, fileUrl, owner }) {
    let point;

    if (fieldActivity === "kegiatanWajib") {
      point = 10;
    } else {
      const path = `./src/data/${fieldActivity}.json`;
      const data = loadData(path);

      point = getBobotSKP(data, { activity, level, possitionAchievement });
    }
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
        years,
        fileUrl,
        ownerId: owner,
      },
    });

    if (!newActivity) {
      throw new InvariantError("failed to add activities");
    }

    return {
      activityId: newActivity.id,
      ownerId: newActivity.ownerId,
    };
  }

  async getActivities(owner) {
    const activites = await this._prisma.activity.findMany({
      select: {
        id: true,
        name: true,
        fieldsActivity: true,
        activity: true,
        points: true,
        status: true,
      },
      where: {
        ownerId: owner,
      },
    });

    if (!activites) {
      throw new NotFoundError("Activity not found");
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
      throw new NotFoundError("activities not found");
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
      throw new NotFoundError("failed to get users. id not found");
    }

    return activity;
  }

  async getValidActivityByFaculty(faculty, status) {
    const activities = await this.getActivitiesByFaculty(faculty);

    if (!activity) {
      throw new NotFoundError("Activity not found");
    }

    const validActivities = activities.filter((activity) => activity.status === status);

    if (!validActivities) {
      throw new NotFoundError("There are no valid activities");
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
      throw new InvariantError("failed to edit activities");
    }

    if (activity.status === "rejected") {
      await this._prisma.rejectedActivity.create({
        data: {
          message,
          activityId: activity.id,
          ownerId: activity.ownerId,
        },
      });
    }
  }

  async getActivityPoints(owner) {
    const activities = await this._prisma.activity.findMany({
      where: {
        ownerId: owner,
        status: "valid",
      },
    });

    if (!activities) {
      return (points = 0);
    }

    const pointsByFieldActivity = activities.reduce((acc, activity) => {
      const { fieldsActivity, points } = activity;

      acc[fieldsActivity] = (acc[fieldsActivity] || 0) + points;
      return acc;
    }, {});

    return pointsByFieldActivity;
  }

  async getRejectedActivities(owner) {
    const activities = await this._prisma.rejectedActivity.findMany({
      select: {
        id: true,
        message: true,
        activity: {
          select: {
            id: true,
            name: true,
            fieldsActivity: true,
          },
        },
      },
      where: {
        ownerId: owner,
      },
    });

    if (!activities) {
      throw new NotFoundError("Activity not found");
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
      throw new NotFoundError("failed to get activity. id not found");
    }

    return activity;
  }

  async verifyActivityOwner(id, owner) {
    const activity = await this._prisma.activity.findUnique({
      where: {
        id,
      },
    });

    if (!activity) {
      throw new NotFoundError("Activity's id not found");
    }

    if (owner !== activity.ownerId) {
      throw new AuthorizationError("The user has no right to access these resources");
    }
  }

  async verifyActivityAccess(userId, activityId) {
    const users = await this._prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const activity = await this._prisma.activity.findUnique({
      where: {
        id: activityId,
      },
      include: {
        owner: true,
      },
    });

    if (users.faculty !== activity.owner.faculty) {
      throw new AuthorizationError("anda tidak berhak mengakses resource ini");
    }
  }
}

export default ActivitiesService;
