/* eslint-disable no-unused-vars */
module.exports.resource = (res, req, next) => {
  next({ status: 404, message: 'Запрашиваемый ресурс не найден' });
};

module.exports.errorMiddleware = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? `На сервере произошла ошибка ${statusCode}.` : `${message} Статус ошибки ${statusCode}.` });
};
