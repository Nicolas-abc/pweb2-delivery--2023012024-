class MotoristasController {
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

  listarTodos(req, res) {
    try { 
      res.status(200).json(this.service.listarTodos()); 
    } catch (err) { 
      res.status(err.status || 500).json({ erro: err.message }); 
    }
  }

  listar(req, res) {
    return this.listarTodos(req, res);
  }

  buscarPorId(req, res) {
    try { 
      res.status(200).json(this.service.buscarPorId(req.params.id)); 
    } catch (err) { 
      res.status(err.status || 500).json({ erro: err.message }); 
    }
  }

  listarEntregas(req, res) {
    try { 
      const statusFiltro = req.query ? req.query.status : undefined;
      // Suporta tanto service.listarEntregasPorMotorista quanto service.listarEntregasDoMotorista
      const fn = this.service.listarEntregasPorMotorista || this.service.listarEntregasDoMotorista;
      res.status(200).json(fn.call(this.service, req.params.id, statusFiltro)); 
    } catch (err) { 
      res.status(err.status || 500).json({ erro: err.message }); 
    }
  }
}

module.exports = MotoristasController;