const {Router} = require('express');
const Database = require('../database/Database')
const EntregasRepository = require('../repositories/EntregasRepository');
const EntregasService = require('../services/EntregaService');
const EntregasController = require('../controllers/entregas.controllers');

const router = Router();

const database  = new Database();
const repository = new EntregasRepository(repository);
const service = new EntregasService(service)
const controller = new EntregasController(service)

router.post('/',(req, res) => controller.criar(req,res));
router.get("/", (req,res) => controller.listar(req,res));
router.get("/:id", (req,res) => controller.buscarPorId(req,res));
router.patch(":id/avançar",(req,res)=> controller.avancar(req,res));
router.patch("/:id/cancelar",(req,res) => controller.cancelar(req,res));
router.get('/:id/historico', (req,res) => controller.historico(req,res));

module.exports = router;
