import { ClientError } from '../exceptions/ClientError.js';

export const errorHandler = (error, req, res, next) => {
  if (error instanceof ClientError) {
    return res.status(error.statusCode).json({
      status: 'fail',
      message: error.message,
    });
  }

  return res.status(500).send(error.message);
};
