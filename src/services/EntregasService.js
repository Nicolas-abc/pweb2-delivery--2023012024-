class EntregasService {
  constructor(entregasRepository, motoristasRepository) {
    this.entregasRepository = entregasRepository;
    this.motoristasRepository = motoristasRepository;
  }

  async criar(dados) {
    if (!dados.origem || !dados.destino) {
      const err = new Error('Origem e destino são obrigatórios');
      err.status = 400;
      throw err;
    }

    if (dados.origem === dados.destino) {
      const err = new Error('Origem e destino não podem ser iguais');
      err.status = 400;
      throw err;
    }

    const ativa = await this.entregasRepository.buscarAtiva(dados.origem, dados.destino);
    if (ativa) {
      const err = new Error('Já existe uma entrega ativa para esta rota');
      err.status = 409;
      throw err;
    }

    return await this.entregasRepository.criar(dados);
  }

  async listar(filtros) {
    return await this.entregasRepository.listar(filtros);
  }

  async buscarPorId(id) {
    return await this.entregasRepository.buscarPorId(id);
  }

  async avancar(id) {
    const entrega = await this.entregasRepository.buscarPorId(id);
    if (!entrega) {
      const err = new Error('Entrega não encontrada');
      err.status = 404;
      throw err;
    }

    let novoStatus = '';
    if (entrega.status === 'CRIADA') {
      novoStatus = 'EM_TRANSITO';
    } else if (entrega.status === 'EM_TRANSITO') {
      novoStatus = 'ENTREGUE';
    } else {
      const err = new Error('Não é possível avançar o status desta entrega');
      err.status = 422;
      throw err;
    }

    await this.entregasRepository.atualizar(id, { status: novoStatus });
    await this.entregasRepository.adicionarHistorico(id, novoStatus);
    return await this.entregasRepository.buscarPorId(id);
  }

  async cancelar(id) {
    const entrega = await this.entregasRepository.buscarPorId(id);
    if (!entrega) {
      const err = new Error('Entrega não encontrada');
      err.status = 404;
      throw err;
    }

    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      const err = new Error('Não é possível cancelar uma entrega finalizada');
      err.status = 422;
      throw err;
    }

    await this.entregasRepository.atualizar(id, { status: 'CANCELADA' });
    await this.entregasRepository.adicionarHistorico(id, 'CANCELADA');
    return await this.entregasRepository.buscarPorId(id);
  }

  async atribuir(entregaId, motoristaId) {
    if (!entregaId || isNaN(Number(entregaId))) {
      const err = new Error('ID da entrega é obrigatório');
      err.status = 400;
      throw err;
    }

    if (!motoristaId || isNaN(Number(motoristaId))) {
      const err = new Error('ID do motorista é obrigatório');
      err.status = 400;
      throw err;
    }

    const entrega = await this.entregasRepository.buscarPorId(entregaId);
    if (!entrega) {
      const err = new Error('Entrega não encontrada');
      err.status = 404;
      throw err;
    }

    if (entrega.status !== 'CRIADA') {
      const err = new Error('Entrega precisa estar no status CRIADA para atribuição');
      err.status = 422;
      throw err;
    }

    const motorista = await this.motoristasRepository.buscarPorId(motoristaId);
    if (!motorista) {
      const err = new Error('Motorista não encontrado');
      err.status = 404;
      throw err;
    }

    if (motorista.status !== 'ATIVO') {
      const err = new Error('Motorista inativo');
      err.status = 422;
      throw err;
    }

    await this.entregasRepository.atualizar(entregaId, { motoristaId: Number(motoristaId) });
    return await this.entregasRepository.buscarPorId(entregaId);
  }

  async buscarHistorico(id) {
    const entrega = await this.entregasRepository.buscarPorId(id);
    if (!entrega) return null;
    return await this.entregasRepository.buscarHistorico(id);
  }
}

module.exports = EntregasService;