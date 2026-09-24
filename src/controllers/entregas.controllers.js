class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar(req, res) {
    try {
      const entrega = this.service.criar(req.body);
      return res.status(201).json(entrega);
    } catch (error) {
      return res.status(error.status || 500).json({ erro: error.message });
    }
  }

  listar(req, res) {
    try {
      const entregas = this.service.listar(req.query.status);
      return res.status(200).json(entregas);
    } catch (error) {
      return res.status(error.status || 500).json({ erro: error.message });
    }
  }

  buscarPorId(req, res) {
    try {
      const entrega = this.service.buscarPorId(req.params.id);
      return res.status(200).json(entrega);
    } catch (error) {
      return res.status(error.status || 500).json({ erro: error.message });
    }
  }

  avancar(req, res) {
    try {
      const entrega = this.service.avancarStatus(req.params.id);
      return res.status(200).json(entrega);
    } catch (error) {
      return res.status(error.status || 500).json({ erro: error.message });
    }
  }

  cancelar(req, res) {
    try {
      const entrega = this.service.cancelar(req.params.id);
      return res.status(200).json(entrega);
    } catch (error) {
      return res.status(error.status || 500).json({ erro: error.message });
    }
  }

  historico(req, res) {
    try {
      const historico = this.service.listarHistorico(req.params.id);
      return res.status(200).json(historico);
    } catch (error) {
      return res.status(error.status || 500).json({ erro: error.message });
    }
  }
}

module.exports = EntregasController;