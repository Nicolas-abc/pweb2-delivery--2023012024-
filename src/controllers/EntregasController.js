class EntregasController {
  constructor(service) { 
    this.service = service; 
  }

  criar(req, res) {
    try { res.status(201).json(this.service.criar(req.body)); }
    catch (err) { res.status(err.status || 500).json({ erro: err.message }); }
  }

  listar(req, res) {
    try { res.status(200).json(this.service.listar(req.query.status)); }
    catch (err) { res.status(500).json({ erro: err.message }); }
  }

  buscarPorId(req, res) {
    try { res.status(200).json(this.service.buscarPorId(req.params.id)); }
    catch (err) { res.status(err.status || 500).json({ erro: err.message }); }
  }

  avancar(req, res) {
    try { res.status(200).json(this.service.avancar(req.params.id)); }
    catch (err) { res.status(err.status || 500).json({ erro: err.message }); }
  }

  cancelar(req, res) {
    try { res.status(200).json(this.service.cancelar(req.params.id)); }
    catch (err) { res.status(err.status || 500).json({ erro: err.message }); }
  }

  historico(req, res) {
    try { res.status(200).json(this.service.obterHistorico(req.params.id)); }
    catch (err) { res.status(err.status || 500).json({ erro: err.message }); }
  }

  atribuir(req, res) {
  try {
    const motoristaId = req.body ? (req.body.motoristaId ?? req.body.motorista_id ?? req.body.id) : undefined;
    res.status(200).json(this.service.atribuirMotorista(req.params.id, motoristaId));
    } catch (err) {
    res.status(err.status || 500).json({ erro: err.message });
    }
}
}

module.exports = EntregasController;