function errorHandler(erro, req, res, next) {
  const status = erro.status || 500;
  const mensagem = erro.message || 'Erro interno do servidor';

  return res.status(status).json({ erro: mensagem });
}

module.exports = { errorHandler };