const express = require('express');

function createEntregasRouter(entregasController) {
  const router = express.Router();

  router.get('/', (req, res, next) => entregasController.listar(req, res, next));
  router.get('/:id', (req, res, next) => entregasController.buscarPorId(req, res, next));
  router.post('/', (req, res, next) => entregasController.criar(req, res, next));
  router.put('/:id', (req, res, next) => entregasController.atualizar(req, res, next));
  
  if (typeof entregasController.adicionarHistorico === 'function') {
    router.post('/:id/historico', (req, res, next) => entregasController.adicionarHistorico(req, res, next));
  }

  return router;
}

module.exports = createEntregasRouter;