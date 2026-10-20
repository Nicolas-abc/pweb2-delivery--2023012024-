class EntregasController {
  constructor(service) { 
    this.service = service; 
  }

  criar(req, res) {
    try { 
      res.status(201).json(this.service.criar(req.body)); 
    } catch (err) { 
      res.status(err.status || 500).json({ erro: err.message }); 
    }
  }

  listar(req, res) {
    try { 
      const statusFiltro = req.query ? req.query.status : undefined;
      res.status(200).json(this.service.listar(statusFiltro)); 
    } catch (err) { 
      res.status(err.status || 500).json({ erro: err.message }); 
    }
  }

  buscarPorId(req, res) {
    try { 
      res.status(200).json(this.service.buscarPorId(req.params.id)); 
    } catch (err) { 
      res.status(err.status || 500).json({ erro: err.message }); 
    }
  }

  avancar(req, res) {
    try { 
      res.status(200).json(this.service.avancar(req.params.id)); 
    } catch (err) { 
      res.status(err.status || 500).json({ erro: err.message }); 
    }
  }

  cancelar(req, res) {
    try { 
      res.status(200).json(this.service.cancelar(req.params.id)); 
    } catch (err) { 
      res.status(err.status || 500).json({ erro: err.message }); 
    }
  }

  historico(req, res) {
    try { 
      const fn = this.service.historico || this.service.obterHistorico;
      res.status(200).json(fn.call(this.service, req.params.id)); 
    } catch (err) { 
      res.status(err.status || 500).json({ erro: err.message }); 
    }
  }

  atribuir(req, res) {
    try {
      const body = req.body || {};
      let motoristaId;
      if (typeof body === 'number' || typeof body === 'string') {
        motoristaId = body;
      } else if (body && typeof body === 'object') {
        motoristaId = body.motoristaId ?? body.motorista_id ?? body.id ?? body.motorista;
        if (motoristaId && typeof motoristaId === 'object') {
          motoristaId = motoristaId.id ?? motoristaId.motoristaId;
        }
      }
      
      res.status(200).json(this.service.atribuirMotorista(req.params.id, motoristaId));
    } catch (err) {
      res.status(err.status || 500).json({ erro: err.message });
    }
  }
}

module.exports = EntregasController;