import { AuthorizationError } from '../exceptions/AuthorizationError.js';
import { InvariantError } from '../exceptions/InvariantError.js';
import ActivitiesService from '../services/ActivitiesService.js';
import SkpiService from '../services/SkpiService.js';
import UsersService from '../services/UsersService.js';

export const postSkpiController = async (req, res) => {
  const userId = req.userId;
  const activitiesService = new ActivitiesService();
  const skpiService = new SkpiService();

  const activityPoints = await activitiesService.getActivityPoints(userId);

  const mandatoryPoints = activityPoints['Kegiatan Wajib'];
  const organizationPoints =
    activityPoints['Bidang Organisasi Kemahasiswaan dan Kepemimpinan'] || 0;
  const talentPoints =
    activityPoints[
      'Bidang Minat, Bakat, Mental Spritiual Kebangsaan dan Kewirausahaan'
    ] || 0;
  const scientificPoints =
    activityPoints[
      'Bidang Penalaran dan Keilmuan, Penyelarasan dan Pengembangan Karir'
    ] || 0;
  const charityPoints = activityPoints['Bidang Kepedulian Sosial'] || 0;
  const otherPoints = activityPoints['Bidang Lainnya'] || 0;

  await skpiService.isExistSkpiByOwner(userId);
  const newSkpi = await skpiService.addSkpi({
    mandatoryPoints,
    organizationPoints,
    scientificPoints,
    talentPoints,
    charityPoints,
    otherPoints,
    owner: userId,
  });

  res.status(201);
  res.json({
    status: 'success',
    message: 'SKPI added',
    data: {
      skpiId: newSkpi.id,
      userId: newSkpi.ownerId,
    },
  });
};

export const getSkpiController = async (req, res) => {
  const { userId, userRole } = req;
  const usersService = new UsersService();
  const skpiService = new SkpiService();

  if (userRole === 'WD' || userRole === 'OPERATOR') {
    const users = await usersService.getUserById(userId);
    const skpi = await skpiService.getSkpiByFaculty(users.faculty);

    return res.json({
      status: 'success',
      data: {
        skpi,
      },
    });
  }

  if (userRole === 'WR') {
    const skpi = await skpiService.getSkpi();

    return res.json({
      status: 'success',
      data: {
        skpi,
      },
    });
  }

  const skpi = await skpiService.getSkpiByOwner(userId);

  res.json({
    status: 'success',
    data: {
      ...skpi,
    },
  });
};

export const getSkpiByIdController = async (req, res) => {
  const { id } = req.params;
  const skpiService = new SkpiService();

  const skpi = await skpiService.getSkpiById(id);

  res.json({
    status: 'success',
    data: {
      ...skpi,
    },
  });
};

export const putStatusSkpiByIdController = async (req, res) => {
  const { id } = req.params;
  const skpiService = new SkpiService();
  const { userRole } = req;
  let status;

  if (userRole !== 'WD' && userRole !== 'WR') {
    throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }

  if (userRole === 'WD') {
    const skpi = await skpiService.getSkpiById(id);

    if (skpi.status !== 'pending') {
      throw new InvariantError('SKPI sudah divalidasi atau sudah selesai');
    }

    status = 'accepted';
  } else {
    const skpi = await skpiService.getSkpiById(id);

    if (skpi.status !== 'accepted') {
      throw new InvariantError('SKPI belum divalidasi oleh pihak Fakultas');
    }

    status = 'completed';
  }

  await skpiService.editStatusSkpiById({ status, id });

  res.json({
    status: 'success',
    message: 'skpi berhasil divalidasi',
  });
};
