class MotoristasService {
  constructor(motoristasRepository, entregasRepository) {
    this.motoristasRepository = motoristasRepository;
    this.entregasRepository = entregasRepository;
  }

  async criar(dados) {
    if (!dados || !dados.nome || !dados.cpf) {
      const err = new Error('Nome e CPF são obrigatórios');
      err.status = 400;
      throw err;
    }

    const existente = await this.motoristasRepository.buscarPorCpf(dados.cpf);
    if (existente) {
      const err = new Error('CPF já cadastrado');
      err.status = 409;
      throw err;
    }

    return await this.motoristasRepository.criar(dados);
  }

  async listar() {
    return await this.motoristasRepository.listar();
  }

  async buscarPorId(id) {
    return await this.motoristasRepository.buscarPorId(id);
  }

  async listarEntregas(id) {
  const motorista = await this.motoristasRepository.buscarPorId(id);
  if (!motorista) {
    const err = new Error('Motorista não encontrado');
    err.status = 404;
    throw err;
  }
  return await this.entregasRepository.buscarPorMotoristaId(id);
}
}

module.exports = MotoristasService;