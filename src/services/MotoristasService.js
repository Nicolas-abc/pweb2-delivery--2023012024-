class MotoristasService {
  constructor(motoristasRepository, entregasRepository) {
    this.motoristasRepository = motoristasRepository;
    this.entregasRepository = entregasRepository;
  }

  criar(dados) {
    if (!dados || !dados.nome || !dados.cpf) {
      const err = new Error('Nome e CPF são obrigatórios');
      err.status = 400;
      throw err;
    }

    const nome = String(dados.nome).trim();
    const cpf = String(dados.cpf).trim();

    if (!nome || !cpf) {
      const err = new Error('Nome e CPF são obrigatórios');
      err.status = 400;
      throw err;
    }

    // Validação de CPF Único -> HTTP 409 Conflict
    if (this.motoristasRepository.buscarPorCpf(cpf)) {
      const err = new Error('CPF já cadastrado');
      err.status = 409;
      throw err;
    }

    return this.motoristasRepository.criar({
      nome,
      cpf,
      ...(dados.placaVeiculo && String(dados.placaVeiculo).trim()
        ? { placaVeiculo: String(dados.placaVeiculo).trim() }
        : {}),
      status: dados.status || 'ATIVO'
    });
  }

  listarTodos() {
    return this.motoristasRepository.listarTodos();
  }

  listar() {
    return this.listarTodos();
  }

  buscarPorId(id) {
    const motorista = this.motoristasRepository.buscarPorId(id);
    if (!motorista) {
      const err = new Error('Motorista não encontrado');
      err.status = 404;
      throw err;
    }
    return motorista;
  }

  listarEntregasDoMotorista(motoristaId, status) {
    // Garante que o motorista existe (lança 404 se não existir)
    this.buscarPorId(motoristaId);

    let entregas = this.entregasRepository.listarTodos().filter(
      e => e.motoristaId !== null && e.motoristaId !== undefined && Number(e.motoristaId) === Number(motoristaId)
    );

    if (status) {
      const statusClean = String(status).trim().toUpperCase();
      entregas = entregas.filter(
        e => e.status && e.status.toUpperCase() === statusClean
      );
    }

    return entregas;
  }

  // Alias para garantir compatibilidade
  listarEntregasPorMotorista(motoristaId, status) {
    return this.listarEntregasDoMotorista(motoristaId, status);
  }
}

module.exports = MotoristasService;