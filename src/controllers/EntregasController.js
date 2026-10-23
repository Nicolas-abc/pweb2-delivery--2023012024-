class EntregasController {
  constructor(entregasService) {
    this.entregasService = entregasService;
  }

  async criar(req, res, next) {
    try {
      const entrega = await this.entregasService.criar(req.body);
      return res.status(201).json(entrega);
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const entregas = await this.entregasService.listar(req.query);
      return res.status(200).json(entregas);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const entrega = await this.entregasService.buscarPorId(id);
      if (!entrega) {
        return res.status(404).json({ erro: 'Entrega não encontrada' });
      }
      return res.status(200).json(entrega);
    } catch (error) {
      next(error);
    }
  }

  async avancar(req, res, next) {
    try {
      const { id } = req.params;
      const entrega = await this.entregasService.avancar(id);
      return res.status(200).json(entrega);
    } catch (error) {
      next(error);
    }
  }

  async cancelar(req, res, next) {
    try {
      const { id } = req.params;
      const entrega = await this.entregasService.cancelar(id);
      return res.status(200).json(entrega);
    } catch (error) {
      next(error);
    }
  }

  async atribuir(req, res, next) {
    try {
      const body = req.body || {};
      const params = req.params || {};

      // Busca entregaId na URL ou no corpo
      const entregaId =
        params.id ??
        body.entregaId ??
        body.entrega_id ??
        body.idEntrega ??
        body.id_entrega ??
        body.id;

      // Busca motoristaId no corpo ou nos parâmetros
      const motoristaId =
        body.motoristaId ??
        body.motorista_id ??
        body.idMotorista ??
        body.id_motorista ??
        params.motoristaId ??
        (typeof body.motorista === 'object' && body.motorista !== null
          ? body.motorista.id
          : body.motorista);

      const entrega = await this.entregasService.atribuir(entregaId, motoristaId);
      return res.status(200).json(entrega);
    } catch (error) {
      next(error);
    }
  }

  async historico(req, res, next) {
    try {
      const { id } = req.params;
      const historico = await this.entregasService.buscarHistorico(id);
      if (!historico) {
        return res.status(404).json({ erro: 'Histórico não encontrado' });
      }
      return res.status(200).json(historico);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EntregasController;