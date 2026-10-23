const prisma = require('../database/prisma');

class MotoristasRepositoryPrisma {
  async listar() {
    return await prisma.motorista.findMany();
  }

  async buscarPorId(id) {
    if (!id || isNaN(Number(id))) return null;
    return await prisma.motorista.findUnique({
      where: { id: Number(id) },
    });
  }

  async buscarPorCpf(cpf) {
    if (!cpf) return null;
    return await prisma.motorista.findUnique({
      where: { cpf: String(cpf) },
    });
  }

  async criar(dados) {
    return await prisma.motorista.create({
      data: {
        nome: dados.nome,
        cpf: String(dados.cpf),
        placaVeiculo: dados.placaVeiculo || null,
        status: dados.status || 'ATIVO',
      },
    });
  }

  async atualizar(id, dados) {
    const dataToUpdate = { ...dados };
    delete dataToUpdate.id;
    return await prisma.motorista.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });
  }

  async deletar(id) {
    return await prisma.motorista.delete({
      where: { id: Number(id) },
    });
  }
}

module.exports = MotoristasRepositoryPrisma;