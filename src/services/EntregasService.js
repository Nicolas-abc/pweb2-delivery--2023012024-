class EntregasService {
  constructor(entregasRepository, motoristasRepository) {
    this.entregasRepository = entregasRepository;
    this.motoristasRepository = motoristasRepository;
  }

  criar(dados) {
    if (!dados || !dados.origem || !dados.destino) {
      const err = new Error('Origem e destino são obrigatórios');
      err.status = 400;
      throw err;
    }

    const origem = String(dados.origem).trim();
    const destino = String(dados.destino).trim();

    if (!origem || !destino) {
      const err = new Error('Origem e destino são obrigatórios');
      err.status = 400;
      throw err;
    }

    if (origem === destino) {
      const err = new Error('Origem e destino não podem ser iguais');
      err.status = 400;
      throw err;
    }

    const duplicada = this.entregasRepository.listarTodos().find(
      e => e.origem === origem && 
           e.destino === destino && 
           e.status !== 'ENTREGUE' && 
           e.status !== 'CANCELADA'
    );

    if (duplicada) {
      const err = new Error('Já existe uma entrega ativa com mesma origem e destino');
      err.status = 409;
      throw err;
    }

    const agora = new Date().toISOString();
    return this.entregasRepository.criar({
      ...dados,
      origem,
      destino,
      status: 'CRIADA',
      motoristaId: null,
      historico: [{ status: 'CRIADA', data: agora }]
    });
  }

  listar(status) {
    return this.entregasRepository.listarTodos(status ? { status } : undefined);
  }

  buscarPorId(id) {
    const entrega = this.entregasRepository.buscarPorId(id);
    if (!entrega) {
      const err = new Error('Entrega não encontrada');
      err.status = 404;
      throw err;
    }
    return entrega;
  }

  avancar(id) {
    const entrega = this.buscarPorId(id);
    const agora = new Date().toISOString();

    if (entrega.status === 'CRIADA') entrega.status = 'EM_TRANSITO';
    else if (entrega.status === 'EM_TRANSITO') entrega.status = 'ENTREGUE';
    else {
      const err = new Error('Não é possível avançar uma entrega finalizada ou cancelada');
      err.status = 422;
      throw err;
    }

    entrega.historico.push({ status: entrega.status, data: agora });
    return this.entregasRepository.atualizar(id, entrega);
  }

  cancelar(id) {
    const entrega = this.buscarPorId(id);
    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      const err = new Error('Não é possível cancelar uma entrega finalizada ou cancelada');
      err.status = 422;
      throw err;
    }

    const agora = new Date().toISOString();
    entrega.status = 'CANCELADA';
    entrega.historico.push({ status: 'CANCELADA', data: agora });
    return this.entregasRepository.atualizar(id, entrega);
  }

  obterHistorico(id) {
    return this.buscarPorId(id).historico;
  }

  atribuirMotorista(entregaId, motoristaId) {
    if (motoristaId === undefined || motoristaId === null || motoristaId === '') {
      const err = new Error('ID do motorista é obrigatório');
      err.status = 400;
      throw err;
    }

    const entrega = this.buscarPorId(entregaId);

    if (entrega.status !== 'CRIADA') {
      const err = new Error('Apenas entregas no status CRIADA podem ser atribuídas');
      err.status = 422;
      throw err;
    }

    const motorista = this.motoristasRepository.buscarPorId(motoristaId);
    if (!motorista) {
      const err = new Error('Motorista não encontrado');
      err.status = 404;
      throw err;
    }

    if (motorista.status !== 'ATIVO') {
      const err = new Error('Apenas motoristas com status ATIVO podem receber entregas');
      err.status = 422;
      throw err;
    }

    entrega.motoristaId = Number(motoristaId);
    return this.entregasRepository.atualizar(entregaId, entrega);
  }
}

module.exports = EntregasService;