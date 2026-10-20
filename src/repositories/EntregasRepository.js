/**
 * @typedef {Object} Entrega
 * @property {number} id
 * @property {string} origem
 * @property {string} destino
 * @property {string} status
 * @property {number|null} motoristaId
 * @property {Array<{evento: string, data: string}>} historico
 */

/**
 * @typedef {Object} IEntregasRepository
 * @property {(filtros?: {status?: string}) => Entrega[]} listarTodos
 * @property {(id: number|string) => Entrega|null} buscarPorId
 * @property {(dados: {origem: string, destino: string}) => Entrega} criar
 * @property {(id: number|string, dados: Object) => Entrega|null} atualizar
 */
class EntregasRepository {
  constructor(database) {
    this.db = database;
  }

  listarTodos(filtros) {
    let resultado = [...(this.db.entregas || [])];
    if (filtros && filtros.status) {
      const statusClean = String(filtros.status).trim().toUpperCase();
      resultado = resultado.filter(
        e => e.status && e.status.toUpperCase() === statusClean
      );
    }
    return resultado;
  }

  listar(filtros) {
    return this.listarTodos(filtros);
  }

  buscarPorId(id) {
    if (id === undefined || id === null) return null;
    return (this.db.entregas || []).find(e => Number(e.id) === Number(id)) || null;
  }

  criar(dados) {
    if (!this.db.currentId) this.db.currentId = 1;
    if (!this.db.entregas) this.db.entregas = [];

    const nova = { 
      id: this.db.currentId++,
      origem: String(dados.origem).trim(),
      destino: String(dados.destino).trim(),
      status: "CRIADA",
      motoristaId: null,
      historico: [
        {
          data: new Date().toISOString(),
          evento: "Entrega criada"
        }
      ] 
    };

    this.db.entregas.push(nova);
    return nova;
  }

  atualizar(id, dados) {
    const index = (this.db.entregas || []).findIndex(e => Number(e.id) === Number(id));
    if (index === -1) return null;
    
    this.db.entregas[index] = { ...this.db.entregas[index], ...dados };
    return this.db.entregas[index];
  }
}

module.exports = EntregasRepository;