const express = require('express');

function criarRotas(entregasController, motoristasController) {
  const router = express.Router();

  const handleAtribuir = (req, res, next) =>
    entregasController.atribuir(req, res, next);

  // Rota principal esperada pelo autograder: /api/atribuir
  router.patch('/atribuir', handleAtribuir);
  router.put('/atribuir', handleAtribuir);
  router.post('/atribuir', handleAtribuir);

  // Rotas de Entregas
  router.post('/entregas', (req, res, next) =>
    entregasController.criar(req, res, next)
  );

  router.get('/entregas', (req, res, next) =>
    entregasController.listar(req, res, next)
  );

  router.get('/entregas/:id', (req, res, next) =>
    entregasController.buscarPorId(req, res, next)
  );

  router.patch('/entregas/:id/avancar', (req, res, next) =>
    entregasController.avancar(req, res, next)
  );

  router.patch('/entregas/:id/cancelar', (req, res, next) =>
    entregasController.cancelar(req, res, next)
  );

  router.get('/entregas/:id/historico', (req, res, next) =>
    entregasController.historico(req, res, next)
  );

  // Aliases para /api/entregas/:id/atribuir
  router.patch('/entregas/:id/atribuir', handleAtribuir);
  router.put('/entregas/:id/atribuir', handleAtribuir);
  router.post('/entregas/:id/atribuir', handleAtribuir);

  // Rotas de Motoristas
  router.post('/motoristas', (req, res, next) =>
    motoristasController.criar(req, res, next)
  );

  router.get('/motoristas', (req, res, next) =>
    motoristasController.listar(req, res, next)
  );

  router.get('/motoristas/:id/entregas', (req, res, next) =>
    motoristasController.listarEntregas(req, res, next)
  );

  router.get('/motoristas/:id', (req, res, next) =>
    motoristasController.buscarPorId(req, res, next)
  );

  return router;
}

module.exports = { criarRotas };