function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  return res.status(status).json({ erro: message });
}

module.exports = errorHandler;