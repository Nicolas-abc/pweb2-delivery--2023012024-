const express = require('express');

const Database = require('../database/Database');

const EntregasRepository = require('../repositories/EntregasRepository');
const MotoristasRepository = require('../repositories/MotoristasRepository');

const EntregasService = require('../services/EntregasService');
const MotoristasService = require('../services/MotoristasService');

const EntregasController = require('../controllers/EntregasController');
const MotoristasController = require('../controllers/MotoristasController');

function criarRotas() {
  const router = express.Router();

  // Instanciação e Injeção de Dependências
  const database = new Database();

  const entregasRepository = new EntregasRepository(database);
  const motoristasRepository = new MotoristasRepository(database);

  const entregasService = new EntregasService(
    entregasRepository,
    motoristasRepository
  );

  const motoristasService = new MotoristasService(
    motoristasRepository,
    entregasRepository
  );

  const entregasController = new EntregasController(entregasService);
  const motoristasController = new MotoristasController(motoristasService);

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

  router.patch('/entregas/:id/atribuir', (req, res, next) =>
    entregasController.atribuir(req, res, next)
  );

  // Rotas de Motoristas
  router.post('/motoristas', (req, res, next) =>
    motoristasController.criar(req, res, next)
  );

  router.get('/motoristas', (req, res, next) =>
    motoristasController.listar(req, res, next)
  );

  // A rota de entregas por motorista deve vir ANTES de /motoristas/:id para evitar conflitos de parâmetros
  router.get('/motoristas/:id/entregas', (req, res, next) =>
    motoristasController.listarEntregas(req, res, next)
  );

  router.get('/motoristas/:id', (req, res, next) =>
    motoristasController.buscarPorId(req, res, next)
  );

  return router;
}

module.exports = { criarRotas };