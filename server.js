const express = require('express');
const { criarRotas } = require('./src/routes/entregas.routes');
const errorHandler = require('./src/utils/errorHandler');

// Repositórios Prisma
const MotoristasRepositoryPrisma = require('./src/repositories/MotoristasRepositoryPrisma');
const EntregasRepositoryPrisma = require('./src/repositories/EntregasRepositoryPrisma');

// Serviços
const MotoristasService = require('./src/services/MotoristasService');
const EntregasService = require('./src/services/EntregasService');

// Controladores
const MotoristasController = require('./src/controllers/MotoristasController');
const EntregasController = require('./src/controllers/EntregasController');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Injeção de Dependências com Prisma
const motoristasRepository = new MotoristasRepositoryPrisma();
const entregasRepository = new EntregasRepositoryPrisma();

const motoristasService = new MotoristasService(motoristasRepository, entregasRepository);
const entregasService = new EntregasService(entregasRepository, motoristasRepository);

const motoristasController = new MotoristasController(motoristasService);
const entregasController = new EntregasController(entregasService);

// Registrar todas as rotas na raiz do Express
app.use('/api', criarRotas(entregasController, motoristasController));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;