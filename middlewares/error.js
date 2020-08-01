/* eslint-disable no-unused-vars */
module.exports.errorMiddleware = (err, req, res, next) => {
  const status = err.statusCode || 500;
  let { message } = err;

  if (err.name === 'ValidationError') {
    return res.status(400).json({ err: `Ошибка валидации:\n${err.message}` });
  }

  if (status === 500) {
    message = 'На сервере произошла ошибка';
  }

  res.status(status).json({ err: message });
  next();
};
