const express = require('express');
const { body, validationResult } = require('express-validator');

function createWebRouter(entregasController, motoristasController) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.redirect('/entregas');
  });

  router.get('/entregas', async (req, res, next) => {
    try {
      const status = req.query.status || '';
      const entregas = await entregasController.entregasService.listar(status ? { status } : {});
      res.render('entregas/index', {
        title: 'Entregas',
        entregas,
        filtroStatus: status,
        motoristas: await motoristasController.motoristasService.listar(),
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/entregas/nova', async (req, res, next) => {
    try {
      const motoristas = await motoristasController.motoristasService.listar();
      res.render('entregas/form', {
        title: 'Nova Entrega',
        entrega: null,
        motoristas,
        errors: [],
        formData: req.flash('formData')[0] || {},
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/entregas', [
    body('descricao').trim().notEmpty().withMessage('Descrição é obrigatória.'),
    body('origem').trim().notEmpty().withMessage('Origem é obrigatória.'),
    body('destino').trim().notEmpty().withMessage('Destino é obrigatório.'),
    body('origem').custom((value, { req }) => value !== req.body.destino || value === '' ? true : false)
      .withMessage('Origem e destino não podem ser iguais.'),
  ], async (req, res, next) => {
    const errors = validationResult(req);
    const formData = {
      descricao: req.body.descricao || '',
      origem: req.body.origem || '',
      destino: req.body.destino || ''
    };

    if (!errors.isEmpty()) {
      req.flash('formData', formData);
      req.flash('error', errors.array()[0].msg);
      return res.status(400).render('entregas/form', {
        title: 'Nova Entrega',
        entrega: null,
        motoristas: await motoristasController.motoristasService.listar(),
        errors: errors.array(),
        formData,
      });
    }

    try {
      await entregasController.entregasService.criar(req.body);
      req.flash('success', 'Entrega criada com sucesso!');
      return res.redirect('/entregas');
    } catch (error) {
      req.flash('formData', formData);
      req.flash('error', error.message || 'Erro ao criar entrega.');
      return res.status(error.status || 400).render('entregas/form', {
        title: 'Nova Entrega',
        entrega: null,
        motoristas: await motoristasController.motoristasService.listar(),
        errors: [{ msg: error.message }],
        formData,
      });
    }
  });

  router.get('/entregas/:id', async (req, res, next) => {
    try {
      const entrega = await entregasController.entregasService.buscarPorId(req.params.id);
      if (!entrega) {
        return res.status(404).render('error/404', {
          title: 'Entrega não encontrada',
          message: 'A entrega solicitada não foi encontrada.'
        });
      }

      const historico = await entregasController.entregasService.buscarHistorico(req.params.id);
      const motoristas = await motoristasController.motoristasService.listar();
      return res.render('entregas/show', {
        title: 'Detalhes da Entrega',
        entrega,
        historico,
        motoristas,
      });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/entregas/:id/avancar', async (req, res, next) => {
    try {
      await entregasController.entregasService.avancar(req.params.id);
      req.flash('success', 'Status avançado com sucesso!');
      return res.redirect('/entregas');
    } catch (error) {
      req.flash('error', error.message || 'Não foi possível avançar a entrega.');
      return res.redirect('/entregas');
    }
  });

  router.patch('/entregas/:id/cancelar', async (req, res, next) => {
    try {
      await entregasController.entregasService.cancelar(req.params.id);
      req.flash('success', 'Entrega cancelada com sucesso!');
      return res.redirect('/entregas');
    } catch (error) {
      req.flash('error', error.message || 'Não foi possível cancelar a entrega.');
      return res.redirect('/entregas');
    }
  });

  router.patch('/entregas/:id/atribuir', async (req, res, next) => {
    try {
      const motoristaId = req.body.motoristaId;
      await entregasController.entregasService.atribuir(req.params.id, motoristaId);
      req.flash('success', 'Motorista atribuído com sucesso!');
      return res.redirect('/entregas');
    } catch (error) {
      req.flash('error', error.message || 'Não foi possível atribuir o motorista.');
      return res.redirect('/entregas');
    }
  });

  router.get('/motoristas', async (req, res, next) => {
    try {
      const motoristas = await motoristasController.motoristasService.listar();
      res.render('motoristas/index', {
        title: 'Motoristas',
        motoristas,
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/motoristas/novo', (req, res) => {
    res.render('motoristas/form', {
      title: 'Novo Motorista',
      motorista: null,
      errors: [],
      formData: req.flash('formData')[0] || {},
    });
  });

  router.post('/motoristas', [
    body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('cpf').trim().notEmpty().withMessage('CPF é obrigatório.'),
  ], async (req, res, next) => {
    const errors = validationResult(req);
    const formData = { nome: req.body.nome || '', cpf: req.body.cpf || '' };

    if (!errors.isEmpty()) {
      req.flash('formData', formData);
      req.flash('error', errors.array()[0].msg);
      return res.status(400).render('motoristas/form', {
        title: 'Novo Motorista',
        motorista: null,
        errors: errors.array(),
        formData,
      });
    }

    try {
      await motoristasController.motoristasService.criar(req.body);
      req.flash('success', 'Motorista cadastrado com sucesso!');
      return res.redirect('/motoristas');
    } catch (error) {
      req.flash('formData', formData);
      req.flash('error', error.message || 'Erro ao criar motorista.');
      return res.status(error.status || 400).render('motoristas/form', {
        title: 'Novo Motorista',
        motorista: null,
        errors: [{ msg: error.message }],
        formData,
      });
    }
  });

  return router;
}

module.exports = createWebRouter;
