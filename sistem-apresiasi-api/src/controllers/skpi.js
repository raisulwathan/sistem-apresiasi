import { AuthorizationError } from '../exceptions/AuthorizationError';

class SkpiControllers {
  constructor({ skpiService, usersService, validator }) {
    this._skpiService = skpiService;
    this._usersService = usersService;
    this._validator = validator;
  }

  async postSkpiController(req, res) {
    this._validator.validatePostSkpiPayload(req.body);

    const userId = req.userId;
    const payload = req.body;

    await this._skpiService.isExistSkpiByOwner(userId);
    const newSkpi = await this._skpiService.addSkpi(payload, userId);

    res.status(201);
    res.json({
      status: 'success',
      message: 'SKPI added',
      data: {
        skpiId: newSkpi.id,
        userId: newSkpi.ownerId,
      },
    });
  }

  async getSkpiController(req, res) {
    const { userId, userRole } = req;

    if (userRole === 'WD') {
      const users = await this._usersService.getUserById(userId);

      const skpi = await this._skpiService.getSkpiByFaculty(users.faculty);

      res.json({
        status: 'success',
        data: {
          skpi,
        },
      });
    }

    if (userRole === 'WR') {
      const skpi = await this._skpiService.getSkpi();

      res.json({
        status: 'success',
        data: {
          skpi,
        },
      });
    }

    const skpi = await this._skpiService.getSkpiByOwner(userId);

    res.json({
      status: 'success',
      data: {
        ...skpi,
      },
    });
  }

  async getSkpiByIdController(req, res) {
    const { id } = req.params;

    const skpi = await this._skpiService.getSkpiById(id);

    res.json({
      status: 'success',
      data: {
        ...skpi,
      },
    });
  }

  async putStatusSkpiByIdController(req, res) {
    const { id } = req.params;
    const userRole = req.userRole;
    let status;

    if (userRole !== 'WD' || userRole !== 'WR') {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    if (userRole === 'WD') {
      status = 'accepted';
    } else {
      status = 'completed';
    }

    await this._skpiService.editStatusSkpiById({ status, id });

    res.json({
      status: 'success',
      message: 'skpi berhasil divalidasi',
    });
  }
}

export default SkpiControllers;
