/** 
 * @typedef {Object} Motorista
 * @property {number} id
 * @property {string} nome 
 * @property {string} cpf
 * @property {string} [placaVeiculo]
 * @property {'ATIVO' | 'INATIVO'} status
 */

/**
 * @typedef {Object} IMotoristasRepository
 * @property {() => Motorista[]} listarTodos
 * @property {(id: number|string) => Motorista|null} buscarPorId
 * @property {(cpf: string) => Motorista|null} buscarPorCpf
 * @property {(dados: {nome: string, cpf: string, placaVeiculo?: string, status?: string}) => Motorista} criar
 */

class MotoristasRepository {
  constructor(database) {
    this.db = database;
  }

  listarTodos() {
    return this.db.motoristas || [];
  }

  listar() {
    return this.listarTodos();
  }

  buscarPorId(id) {
    if (id === undefined || id === null) return null;
    return (this.db.motoristas || []).find(m => Number(m.id) === Number(id)) || null;
  }

  buscarPorCpf(cpf) {
    if (!cpf) return null;
    const cpfStr = String(cpf).trim();
    return (this.db.motoristas || []).find(m => String(m.cpf).trim() === cpfStr) || null;
  }

  criar(dados) {
    if (!this.db.currentMotoristaId) this.db.currentMotoristaId = 1;
    if (!this.db.motoristas) this.db.motoristas = [];

    const motorista = {
      id: this.db.currentMotoristaId++,
      nome: String(dados.nome).trim(),
      cpf: String(dados.cpf).trim(),
      ...(dados.placaVeiculo && String(dados.placaVeiculo).trim()
        ? { placaVeiculo: String(dados.placaVeiculo).trim() }
        : {}),
      status: dados.status || 'ATIVO'
    };

    this.db.motoristas.push(motorista);
    return motorista;
  }
}

module.exports = MotoristasRepository;