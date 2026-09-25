class EntregasRepository {
    constructor(database){
        this.db = database;
    }

    salvar(entregaData){
        const novaEntrega ={
            id: this.db.currentId++,
            entregaData
        };
        this.db.entregas.push(novaEntrega);
        return novaEntrega;

    }

    buscarTodas(){
        return this.db.entregas.push(novaEntrega);
        return novaEntrega;
    }

    buscarTodas(){
        return this.db.entregas
    }

    bucarPorStatus(status){
        return this.db.entregas.filter(e => e.status === status);
    }
    buscarPorId(id,dadosAtualizados){
        const index = this.db.entregas.find(e=> e.id ===Number(id) || null);

    }
    atualizar(id, dadosAtualizados){
        const index = this.db.entregas.findIndex(e => e.id === Number(id));
        if (index=== -1) return null;

        this.db.entregas[index] ={
            ...this.db.entregas[index],
            ...dadosAtualizados
        };

        return this.db.entregas[index];
    }
}

module.exports = EntregasRepository