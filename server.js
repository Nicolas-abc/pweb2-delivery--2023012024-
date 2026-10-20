const express = require('express');

// Módulos
const Database = require('./src/database/Database');

// Repositórios
const EntregasRepository = require('./src/repositories/EntregasRepository');
const MotoristasRepository = require('./src/repositories/MotoristasRepository');

// Serviços
const EntregasService = require('./src/services/EntregasService');
const MotoristasService = require('./src/services/MotoristasService');

// Controllers
const EntregasController = require('./src/controllers/EntregasController');
const MotoristasController = require('./src/controllers/MotoristasController');

const app = express();
app.use(express.json());

// Middleware de tratamento de erros global
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  return res.status(status).json({ erro: err.message || 'Erro interno do servidor' });
};

// --- COMPOSITION ROOT (Injeção de Dependências em Ponto Único) ---
const database = new Database();

const entregasRepo = new EntregasRepository(database);
const motoristasRepo = new MotoristasRepository(database);

const entregasService = new EntregasService(entregasRepo, motoristasRepo);
const motoristasService = new MotoristasService(motoristasRepo, entregasRepo);

const entregasController = new EntregasController(entregasService);
const motoristasController = new MotoristasController(motoristasService);

// Health check
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Rotas de Entregas
app.post('/api/entregas', (req, res) => entregasController.criar(req, res));
app.get('/api/entregas', (req, res) => entregasController.listar(req, res));
app.get('/api/entregas/:id', (req, res) => entregasController.buscarPorId(req, res));
app.patch('/api/entregas/:id/avancar', (req, res) => entregasController.avancar(req, res));
app.patch('/api/entregas/:id/cancelar', (req, res) => entregasController.cancelar(req, res));
app.get('/api/entregas/:id/historico', (req, res) => entregasController.historico(req, res));
app.patch('/api/entregas/:id/atribuir', (req, res) => entregasController.atribuir(req, res));

// Rotas de Motoristas (Ordem correta: subrotas específicas antes de /:id)
app.post('/api/motoristas', (req, res) => motoristasController.criar(req, res));
app.get('/api/motoristas', (req, res) => motoristasController.listarTodos(req, res));
app.get('/api/motoristas/:id/entregas', (req, res) => motoristasController.listarEntregas(req, res));
app.get('/api/motoristas/:id', (req, res) => motoristasController.buscarPorId(req, res));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app;