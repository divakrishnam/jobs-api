// const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.status).json({ msg: err.message });
  // }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    customError.status = 400;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.status = 400;
  }

  if (err.name === 'CastError') {
    (customError.msg = `No item with id : ${err.value}`),
      (customError.status = 404);
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.status).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
