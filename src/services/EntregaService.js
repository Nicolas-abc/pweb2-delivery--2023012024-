class EntregasService {
  constructor(repository) {
    this.repository = repository;
  }

  criar(dados) {
    const { descricao, origem, destino } = dados;

    if (!descricao || !origem || !destino) {
      throw { status: 400, message: "Os campos descricao, origem e destino são obrigatórios." };
    }

    if (origem === destino) {
      throw { status: 400, message: "A origem não pode ser igual ao destino." };
    }

    const todas = this.repository.buscarTodas();
    const duplicataAtiva = todas.find(e =>
      e.descricao === descricao &&
      e.origem === origem &&
      e.destino === destino &&
      e.status !== 'ENTREGUE' &&
      e.status !== 'CANCELADA'
    );

    if (duplicataAtiva) {
      throw { status: 409, message: "Já existe uma entrega ativa com a mesma descrição, origem e destino." };
    }

    const historicoInicial = [
      {
        data: new Date().toISOString(),
        descricao: "Entrega criada"
      }
    ];

    return this.repository.salvar({
      descricao,
      origem,
      destino,
      status: "CRIADA",
      motoristaId: null,
      historico: historicoInicial
    });
  }

  listar(status) {
    if (status) {
      return this.repository.buscarPorStatus(status);
    }
    return this.repository.buscarTodas();
  }

  buscarPorId(id) {
    const entrega = this.repository.buscarPorId(id);
    if (!entrega) {
      throw { status: 404, message: "Entrega não encontrada." };
    }
    return entrega;
  }

  avancarStatus(id) {
    const entrega = this.buscarPorId(id);

    let novoStatus;

    if (entrega.status === 'CRIADA') {
      novoStatus = 'EM_TRANSITO';
    } else if (entrega.status === 'EM_TRANSITO') {
      novoStatus = 'ENTREGUE';
    } else {
      throw { status: 422, message: `Não é possível avançar o status a partir de ${entrega.status}.` };
    }

    const novoHistorico = [
      ...entrega.historico,
      {
        data: new Date().toISOString(),
        descricao: `Status alterado para ${novoStatus}`
      }
    ];

    return this.repository.atualizar(id, {
      status: novoStatus,
      historico: novoHistorico
    });
  }

  cancelar(id) {
    const entrega = this.buscarPorId(id);

    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      throw { status: 422, message: `Não é possível cancelar uma entrega com status ${entrega.status}.` };
    }

    const novoHistorico = [
      ...entrega.historico,
      {
        data: new Date().toISOString(),
        descricao: "Entrega cancelada"
      }
    ];

    return this.repository.atualizar(id, {
      status: 'CANCELADA',
      historico: novoHistorico
    });
  }

  listarHistorico(id) {
    const entrega = this.buscarPorId(id);
    return entrega.historico;
  }
}

module.exports = EntregasService;