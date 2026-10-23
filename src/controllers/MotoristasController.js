class MotoristasController {
  constructor(motoristasService) {
    this.motoristasService = motoristasService;
  }

  async criar(req, res, next) {
    try {
      const motorista = await this.motoristasService.criar(req.body);
      return res.status(201).json(motorista);
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const motoristas = await this.motoristasService.listar();
      return res.status(200).json(motoristas);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const motorista = await this.motoristasService.buscarPorId(id);
      if (!motorista) {
        return res.status(404).json({ erro: 'Motorista não encontrado' });
      }
      return res.status(200).json(motorista);
    } catch (error) {
      next(error);
    }
  }

  async listarEntregas(req, res, next) {
    try {
      const { id } = req.params;
      const entregas = await this.motoristasService.listarEntregas(id);
      return res.status(200).json(entregas);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MotoristasController;