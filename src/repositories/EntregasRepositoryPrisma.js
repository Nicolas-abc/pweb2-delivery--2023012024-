const prisma = require('../database/prisma');

function formatEntrega(entrega) {
  if (!entrega) return null;

  const motoristaObj = entrega.motorista
    ? {
        id: entrega.motorista.id,
        nome: entrega.motorista.nome,
        cpf: entrega.motorista.cpf,
        placaVeiculo: entrega.motorista.placaVeiculo ?? entrega.motorista.placa_veiculo ?? null,
        placa_veiculo: entrega.motorista.placaVeiculo ?? entrega.motorista.placa_veiculo ?? null,
        status: entrega.motorista.status,
      }
    : null;

  const mId =
    entrega.motoristaId ??
    entrega.motorista_id ??
    (entrega.motorista ? entrega.motorista.id : null);

  return {
    id: entrega.id,
    origem: entrega.origem,
    destino: entrega.destino,
    status: entrega.status,
    motoristaId: mId,
    motorista_id: mId,
    motorista: motoristaObj,
    historico: entrega.historico || [],
  };
}

class EntregasRepositoryPrisma {
  async listar(filtros = {}) {
    let where = {};
    const statusVal = typeof filtros === 'string' ? filtros : filtros?.status;
    const motoristaIdVal =
      typeof filtros === 'object'
        ? filtros?.motoristaId ?? filtros?.motorista_id
        : undefined;

    if (statusVal) where.status = statusVal;

    try {
      if (motoristaIdVal) where.motoristaId = Number(motoristaIdVal);
      const entregas = await prisma.entrega.findMany({
        where,
        include: { historico: true, motorista: true },
      });
      return entregas.map(formatEntrega);
    } catch (err) {
      where = {};
      if (statusVal) where.status = statusVal;
      if (motoristaIdVal) where.motorista_id = Number(motoristaIdVal);
      const entregas = await prisma.entrega.findMany({
        where,
        include: { historico: true, motorista: true },
      });
      return entregas.map(formatEntrega);
    }
  }

  async buscarPorId(id) {
    if (!id || isNaN(Number(id))) return null;
    const entrega = await prisma.entrega.findUnique({
      where: { id: Number(id) },
      include: { historico: true, motorista: true },
    });
    return formatEntrega(entrega);
  }

  async buscarPorMotoristaId(motoristaId) {
    if (!motoristaId || isNaN(Number(motoristaId))) return [];
    try {
      const entregas = await prisma.entrega.findMany({
        where: { motoristaId: Number(motoristaId) },
        include: { historico: true, motorista: true },
      });
      return entregas.map(formatEntrega);
    } catch (err) {
      const entregas = await prisma.entrega.findMany({
        where: { motorista_id: Number(motoristaId) },
        include: { historico: true, motorista: true },
      });
      return entregas.map(formatEntrega);
    }
  }

  async buscarAtiva(origem, destino) {
    const entrega = await prisma.entrega.findFirst({
      where: {
        origem,
        destino,
        status: 'CRIADA',
        motoristaId: null,
      },
      include: { historico: true, motorista: true },
    });
    return formatEntrega(entrega);
  }

  async criar(dados) {
    const rawMotoristaId = dados.motoristaId ?? dados.motorista_id;
    const createData = {
      origem: dados.origem,
      destino: dados.destino,
      status: dados.status || 'CRIADA',
      historico: {
        create: {
          evento: 'CRIADA',
          data: new Date().toISOString(),
        },
      },
    };

    if (rawMotoristaId && !isNaN(Number(rawMotoristaId))) {
      try {
        const entrega = await prisma.entrega.create({
          data: {
            ...createData,
            motoristaId: Number(rawMotoristaId),
          },
          include: { historico: true, motorista: true },
        });
        return formatEntrega(entrega);
      } catch (e) {
        try {
          const entrega = await prisma.entrega.create({
            data: {
              ...createData,
              motorista: { connect: { id: Number(rawMotoristaId) } },
            },
            include: { historico: true, motorista: true },
          });
          return formatEntrega(entrega);
        } catch (e2) {}
      }
    }

    const entrega = await prisma.entrega.create({
      data: createData,
      include: { historico: true, motorista: true },
    });
    return formatEntrega(entrega);
  }

  async atualizar(id, dados) {
    const dataToUpdate = {};
    if (dados.status !== undefined) dataToUpdate.status = dados.status;
    if (dados.origem !== undefined) dataToUpdate.origem = dados.origem;
    if (dados.destino !== undefined) dataToUpdate.destino = dados.destino;

    const rawMotoristaId = dados.motoristaId ?? dados.motorista_id;

    if (rawMotoristaId !== undefined && rawMotoristaId !== null) {
      const mId = Number(rawMotoristaId);
      try {
        const entrega = await prisma.entrega.update({
          where: { id: Number(id) },
          data: {
            ...dataToUpdate,
            motoristaId: mId,
          },
          include: { historico: true, motorista: true },
        });
        return formatEntrega(entrega);
      } catch (err1) {
        try {
          const entrega = await prisma.entrega.update({
            where: { id: Number(id) },
            data: {
              ...dataToUpdate,
              motorista: { connect: { id: mId } },
            },
            include: { historico: true, motorista: true },
          });
          return formatEntrega(entrega);
        } catch (err2) {
          const entrega = await prisma.entrega.update({
            where: { id: Number(id) },
            data: {
              ...dataToUpdate,
              motorista_id: mId,
            },
            include: { historico: true, motorista: true },
          });
          return formatEntrega(entrega);
        }
      }
    }

    const entrega = await prisma.entrega.update({
      where: { id: Number(id) },
      data: dataToUpdate,
      include: { historico: true, motorista: true },
    });
    return formatEntrega(entrega);
  }

  async adicionarHistorico(entregaId, evento) {
    const nomeEvento =
      typeof evento === 'object' ? evento.evento || evento.status : evento;

    return await prisma.historicoEntrega.create({
      data: {
        entregaId: Number(entregaId),
        evento: nomeEvento || 'ATUALIZACAO',
        data: new Date().toISOString(),
      },
    });
  }

  async buscarHistorico(entregaId) {
    return await prisma.historicoEntrega.findMany({
      where: { entregaId: Number(entregaId) },
      orderBy: { id: 'asc' },
    });
  }
}

module.exports = EntregasRepositoryPrisma;