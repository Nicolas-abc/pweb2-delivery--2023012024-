/**
 * @typedef {Object} Entrega
 * @property {number} id
 * @property {string} origem
 * @property {string} destino
 * @property {string} status
 * @property {number|null} motoristaId
 * @property {Array<{status: string, data: string}>} historico
 */

/**
 * @interface IEntregasRepository
 */
class EntregasRepository {
  constructor(database) {
    this.db = database;
  }

  /**
   * @param {Object} [filtros]
   * @param {string} [filtros.status]
   * @returns {Entrega[]}
   */
  listarTodos(filtros) {
    if (filtros && filtros.status) {
      return this.db.entregas.filter(e => e.status === filtros.status);
    }
    return this.db.entregas;
  }

  /**
   * @param {number|string} id
   * @returns {Entrega|null}
   */
  buscarPorId(id) {
    return this.db.entregas.find(e => e.id === Number(id)) || null;
  }

  /**
   * @param {Object} dados
   * @returns {Entrega}
   */
  criar(dados) {
    const nova = { id: this.db.currentId++, ...dados };
    this.db.entregas.push(nova);
    return nova;
  }

  /**
   * @param {number|string} id
   * @param {Object} dados
   * @returns {Entrega|null}
   */
  atualizar(id, dados) {
    const index = this.db.entregas.findIndex(e => e.id === Number(id));
    if (index === -1) return null;
    this.db.entregas[index] = { ...this.db.entregas[index], ...dados };
    return this.db.entregas[index];
  }
}

module.exports = EntregasRepository;
