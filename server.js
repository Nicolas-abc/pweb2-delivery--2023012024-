const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const { criarRotas } = require('./src/routes/entregas.routes');
const webRouter = require('./src/routes/web.routes');
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(expressLayouts);
app.set('layout', 'layouts/base');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'delivery-tracker-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.formData = {};
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

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

// Registrar rotas da API
app.use('/api', criarRotas(entregasController, motoristasController));

// Registrar rotas web SSR
app.use('/', webRouter(entregasController, motoristasController));

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ erro: 'Não encontrado' });
  }

  return res.status(404).render('error/404', {
    title: 'Página não encontrada',
    message: 'A página que você tentou acessar não existe.'
  });
});

app.use((err, req, res, next) => {
  if (req.path.startsWith('/api')) {
    return errorHandler(err, req, res, next);
  }

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  return res.status(status).render('error/500', {
    title: 'Erro',
    status,
    message
  });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;