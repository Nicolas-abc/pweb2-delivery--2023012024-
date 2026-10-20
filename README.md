# Delivery Tracker — API (Capítulo 4)

> **Programação Web II — IFAL/Maceió**  
> API desenvolvida em Node.js e Express aplicando Arquitetura em Camadas, Repository Pattern, Contratos JSDoc e Injeção de Dependências via Composition Root.

---

## 🎯 Status e Avaliação
- **Autograder**: 122/122 (100% de conformidade)
- **Etapa**: Atividade 05 (Entregas em Camadas) & Atividade 06 (Motoristas, Contratos e DI) Concluídas

---

## 🚀 Como Executar o Projeto

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar a aplicação (servidor em http://localhost:3000)
npm start

# 3. Executar o autograder de validação (em outro terminal)
npm run check



pweb2-delivery-<matricula>/
├── autograder/          # Testes automatizados de conformidade
├── src/
│   ├── controllers/     # Camada HTTP (EntregasController, MotoristasController)
│   ├── database/        # Simulação de banco de dados em memória (Database)
│   ├── repositories/    # Persistência com contratos JSDoc (EntregasRepository, MotoristasRepository)
│   ├── services/        # Regras de negócio da aplicação (EntregasService, MotoristasService)
│   └── utils/           # Middlewares utilitários e de erro (errorHandler)
└── server.js            # Composition Root e inicialização do Express

Rotas da API
Health Check
GET /api/health

Sucesso: 200 OK (Status da API)

Entregas (/api/entregas)
POST /api/entregas

Payload: { origem, destino }

Sucesso: 201 Created

Erros: 400 Bad Request (Campos), 409 Conflict (Duplicada ativa)

GET /api/entregas

Filtro opcional: ?status=CRIADA

Sucesso: 200 OK

GET /api/entregas/:id

Sucesso: 200 OK

Erros: 404 Not Found (Entrega não encontrada)

PATCH /api/entregas/:id/avancar

Sucesso: 200 OK

Erros: 404 Not Found, 422 Unprocessable Entity (Transição inválida)

PATCH /api/entregas/:id/cancelar

Sucesso: 200 OK

Erros: 404 Not Found, 422 Unprocessable Entity (Cancelamento inválido)

GET /api/entregas/:id/historico

Sucesso: 200 OK

Erros: 404 Not Found

PATCH /api/entregas/:id/atribuir

Payload: { motoristaId }

Sucesso: 200 OK

Erros: 400 Bad Request, 404 Not Found, 422 Unprocessable Entity

Motoristas (/api/motoristas)
POST /api/motoristas

Payload: { nome, cpf, placaVeiculo? }

Sucesso: 201 Created (status ATIVO)

Erros: 400 Bad Request, 409 Conflict (CPF duplicado)

GET /api/motoristas

Sucesso: 200 OK

GET /api/motoristas/:id

Sucesso: 200 OK

Erros: 404 Not Found

GET /api/motoristas/:id/entregas

Filtro opcional: ?status=CRIADA

Sucesso: 200 OK

Erros: 404 Not Found (Motorista não encontrado)

+-----------------------------------------------------------------------+
|                           Composition Root                            |
|                              (server.js)                              |
+-----------------------------------------------------------------------+
                                    |
                                    v
                          +------------------+
                          |     Database     |
                          +------------------+
                             /            \
                            /              \
                           v                v
        +----------------------+   +-----------------------+
        |  EntregasRepository  |   | MotoristasRepository  |
        | (IEntregasRepository)|   |(IMotoristasRepository)|
        +----------------------+   +-----------------------+
                   \                   /       \
                    \                 /         \
                     v               v           v
          +-----------------------+   +-------------------+
          |    EntregasService    |   | MotoristasService |
          +-----------------------+   +-------------------+
                      |                         |
                      v                         v
          +-----------------------+   +----------------------+
          |   EntregasController  |   | MotoristasController |
          +-----------------------+   +----------------------+