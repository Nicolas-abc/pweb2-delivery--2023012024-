class Database {
  constructor() {
    this.entregas = [];
    this.motoristas = [];
    this.currentId = 1;          // Utilizado pelo EntregasRepository
    this.currentMotoristaId = 1; // Ou utilizado pelo MotoristasRepository
  }
}

module.exports = Database;