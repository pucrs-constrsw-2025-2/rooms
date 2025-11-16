# 🏢 Rooms API

API REST para gerenciamento de salas e mobílias, desenvolvida com NestJS, Prisma e PostgreSQL, com autenticação OAuth via JWT.

## 📋 Índice

- [Sobre](#-sobre)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Documentação da API](#-documentação-da-api)
- [Autenticação](#-autenticação)
- [Endpoints Principais](#-endpoints-principais)
- [Testes](#-testes)
- [Estrutura do Projeto](#-estrutura-do-projeto)

## 📖 Sobre

O serviço **Rooms** é responsável pelo gerenciamento de salas e mobílias em um ambiente educacional. Permite criar, listar, atualizar e remover salas, além de gerenciar os móveis associados a cada sala.

### Principais Funcionalidades

- ✅ CRUD completo de salas (Rooms)
- ✅ CRUD completo de mobílias (Furnitures)
- ✅ Filtragem e paginação de salas
- ✅ Autenticação via OAuth/JWT
- ✅ Validação de dados com class-validator
- ✅ Documentação interativa com Swagger UI
- ✅ Banco de dados PostgreSQL com Prisma ORM

## 🏗️ Arquitetura

### Visão Geral

O serviço **Rooms** segue uma **arquitetura de microserviços** baseada em containers Docker, utilizando o padrão **MVC (Model-View-Controller)** adaptado para APIs REST com NestJS.

### Componentes da Arquitetura

#### 1. **Controllers (Camada de Apresentação)**
- **Responsabilidade**: Receber requisições HTTP, validar entrada e retornar respostas
- **Localização**: `src/modules/rooms/*.controller.ts`
- **Características**:
  - Decorators NestJS (`@Controller`, `@Get`, `@Post`, etc.)
  - Validação automática com DTOs (Data Transfer Objects)
  - Documentação Swagger com decorators (`@ApiOperation`, `@ApiResponse`)
  - Proteção com Guards (`@UseGuards(JwtAuthGuard)`)

#### 2. **Guards (Camada de Segurança)**
- **Responsabilidade**: Validar autenticação e autorização
- **Localização**: `src/oauth/jwt-auth.guard.ts`
- **Fluxo**:
  1. Extrai token JWT do header `Authorization`
  2. Valida token com serviço OAuth (`POST /validate`)
  3. Anexa dados do usuário ao request (`request.user`)
  4. Permite ou nega acesso ao endpoint

#### 3. **Services (Camada de Negócio)**
- **Responsabilidade**: Lógica de negócio, regras de validação e orquestração
- **Localização**: `src/modules/rooms/*.service.ts`
- **Características**:
  - Isolamento da lógica de negócio
  - Tratamento de erros customizados
  - Validações complexas
  - Comunicação com Prisma ORM

#### 4. **Prisma ORM (Camada de Dados)**
- **Responsabilidade**: Abstração do banco de dados, queries type-safe
- **Localização**: `prisma/schema.prisma`
- **Características**:
  - Schema declarativo
  - Migrations automáticas
  - Type-safe queries
  - Auto-completion no IDE

#### 5. **PostgreSQL (Persistência)**
- **Responsabilidade**: Armazenamento persistente de dados
- **Características**:
  - Container Docker isolado
  - Schemas relacionais
  - ACID compliance

### Padrões de Projeto Utilizados

#### **Dependency Injection (DI)**
```typescript
@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}
  // Prisma é injetado automaticamente pelo NestJS
}
```

#### **Repository Pattern (via Prisma)**
```typescript
// Prisma Client atua como repository
await this.prisma.room.findMany({ where: { ... } });
```

#### **Guard Pattern (Segurança)**
```typescript
@UseGuards(JwtAuthGuard)
export class RoomsController {
  // Todos os métodos protegidos automaticamente
}
```

#### **DTO Pattern (Data Transfer Objects)**
```typescript
export class CreateRoomDto {
  @IsNumber()
  capacity: number;
  
  @IsString()
  number: string;
  // Validação automática
}
```

### Fluxo de uma Requisição

```
1. Cliente → POST /api/v1/rooms (+ JWT Token)
           ↓
2. NestJS Router → RoomsController.create()
           ↓
3. JwtAuthGuard → Valida token com OAuth Service
           ↓
4. ValidationPipe → Valida CreateRoomDto
           ↓
5. RoomsService.create() → Lógica de negócio
           ↓
6. Prisma Client → INSERT INTO rooms (...)
           ↓
7. PostgreSQL → Persiste dados
           ↓
8. Response ← { id, capacity, number, ... } (201 Created)
```

### Comunicação entre Serviços

#### **Rooms ↔ OAuth (Síncrona)**
- **Protocolo**: HTTP REST
- **Endpoint**: `POST http://oauth:8000/validate`
- **Formato**: JSON
- **Propósito**: Validação de tokens JWT em cada requisição

#### **Rooms ↔ PostgreSQL (Síncrona)**
- **Protocolo**: PostgreSQL Wire Protocol
- **ORM**: Prisma Client
- **Connection Pool**: Gerenciado pelo Prisma
- **Formato**: SQL queries

### Containerização e Orquestração

```yaml
# docker-compose.yml (simplificado)
services:
  postgresql:
    image: postgres:17-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  oauth:
    build: ./backend/oauth
    depends_on:
      - keycloak
    
  rooms:
    build: ./backend/rooms
    depends_on:
      - postgresql
      - oauth
    environment:
      - DATABASE_URL=postgresql://...
      - OAUTH_VALIDATE_URL=http://oauth:8000/validate
```

### Estratégia de Build Multi-Stage

```dockerfile
# Stage 1: Instalar dependências
FROM node:20-alpine AS deps
COPY package*.json ./
RUN npm install

# Stage 2: Build da aplicação
FROM node:20-alpine AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate
RUN npm run build

# Stage 3: Imagem de produção (menor)
FROM node:20-alpine AS runner
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["npm", "run", "start:prod"]
```

### Escalabilidade e Performance

#### **Horizontal Scaling**
- Stateless design permite múltiplas instâncias
- Load balancer pode distribuir requisições
- Sessões gerenciadas via JWT (sem estado no servidor)

#### **Vertical Scaling**
- Node.js single-threaded, mas eficiente para I/O
- Connection pooling do Prisma otimiza DB connections

#### **Caching Strategy**
- OAuth tokens validados são descartados (stateless)
- Possível implementar Redis para cache de queries frequentes

### Segurança

#### **Camadas de Segurança**
1. **Network**: Containers isolados, comunicação interna via Docker network
2. **Authentication**: JWT tokens validados a cada requisição
3. **Authorization**: Guards verificam permissões
4. **Validation**: DTOs validam inputs (previne SQL injection, XSS)
5. **HTTPS**: Recomendado em produção (não configurado em dev)

#### **Princípios Aplicados**
- ✅ **Least Privilege**: Serviços acessam apenas o necessário
- ✅ **Defense in Depth**: Múltiplas camadas de validação
- ✅ **Fail Securely**: Erros retornam 401/403, sem expor detalhes
- ✅ **Input Validation**: class-validator em todos os DTOs

### Monitoramento e Observabilidade

#### **Logs**
```bash
# Visualizar logs em tempo real
docker compose logs -f rooms

# Logs do NestJS incluem:
# - Startup logs
# - Route mappings
# - Request errors
# - Database queries (via Prisma)
```

#### **Health Checks**
```yaml
# docker-compose.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Considerações de Design

#### **Por que NestJS?**
- ✅ Arquitetura modular e escalável
- ✅ TypeScript nativo (type safety)
- ✅ Dependency Injection built-in
- ✅ Ecossistema maduro (Swagger, Prisma, etc.)
- ✅ Fácil manutenção e testes

#### **Por que Prisma?**
- ✅ Type-safe queries
- ✅ Migrations automáticas
- ✅ Schema declarativo e intuitivo
- ✅ Performance otimizada
- ✅ Suporte a múltiplos bancos de dados

#### **Por que Docker?**
- ✅ Ambiente consistente (dev/prod)
- ✅ Isolamento de dependências
- ✅ Fácil deploy e escalabilidade
- ✅ Integração com CI/CD



## 🚀 Tecnologias

- **[NestJS](https://nestjs.com/)** v10 - Framework Node.js
- **[Prisma](https://www.prisma.io/)** v6 - ORM para PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** 17 - Banco de dados
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação da API
- **[Docker](https://www.docker.com/)** - Containerização
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação

## 📦 Pré-requisitos

- **Docker** e **Docker Compose** instalados
- Serviço **OAuth** rodando (para autenticação)
- Serviço **PostgreSQL** rodando (gerenciado pelo docker-compose)

## 🔧 Instalação e Execução

### Usando Docker Compose (Recomendado)

```bash
# Na raiz do projeto
cd c:\Dev\base

# Subir todos os serviços (PostgreSQL, OAuth, Rooms)
docker compose up -d

# Ou subir apenas o serviço rooms
docker compose up -d rooms

# Visualizar logs
docker compose logs -f rooms

# Parar o serviço
docker compose down
```

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run prisma:generate

# Executar migrações do banco
npx prisma migrate dev

# Modo desenvolvimento (hot-reload)
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

## 📚 Documentação da API

A documentação interativa da API está disponível via Swagger UI:

- **Swagger UI**: http://localhost:8188/api/v1/docs
- **OpenAPI JSON**: http://localhost:8188/api/v1/docs-json

### Como Usar o Swagger

1. Acesse http://localhost:8188/api/v1/docs
2. Obtenha um token de acesso via serviço OAuth
3. Clique no botão **"Authorize"** 🔒
4. Cole o token JWT (sem "Bearer")
5. Teste os endpoints diretamente na interface

Para mais detalhes, consulte [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)

## 🔐 Autenticação

Este serviço utiliza autenticação **OAuth 2.0 com JWT Bearer Token**.

### Obtendo o Token

```bash
# Via OAuth service
curl -X POST "http://localhost:8180/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@pucrs.br&password=a12345678"
```

### Usando o Token

```bash
# Exemplo: Listar salas
curl -X GET "http://localhost:8188/api/v1/rooms" \
  -H "Authorization: Bearer <seu_token_aqui>"
```

### Variáveis de Ambiente

```bash
# Endpoint de validação do OAuth (configurado automaticamente no docker-compose)
OAUTH_VALIDATE_URL=http://oauth:8000/validate

# Porta do serviço (padrão: 8080 internamente, 8188 exposta)
PORT=8080
ROOMS_INTERNAL_API_PORT=8080

# Desabilitar autenticação (apenas desenvolvimento)
DISABLE_AUTH=false
```

## 🛣️ Endpoints Principais

### Rooms (Salas)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/rooms` | Lista todas as salas (com filtros e paginação) |
| `POST` | `/api/v1/rooms` | Cria uma nova sala |
| `GET` | `/api/v1/rooms/:id` | Busca sala por ID |
| `PUT` | `/api/v1/rooms/:id` | Atualiza sala completamente |
| `PATCH` | `/api/v1/rooms/:id` | Atualiza sala parcialmente |
| `DELETE` | `/api/v1/rooms/:id` | Remove uma sala |

### Furnitures (Mobílias)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/rooms/:roomId/furnitures` | Lista mobílias de uma sala |
| `POST` | `/api/v1/rooms/:roomId/furnitures` | Adiciona mobília à sala |
| `DELETE` | `/api/v1/rooms/:roomId/furnitures/:furnitureId` | Remove mobília |

### Exemplo de Requisição

```json
// POST /api/v1/rooms
{
  "capacity": 30,
  "number": "101",
  "building": "Main",
  "category": "CLASSROOM",
  "floor": 1,
  "description": "Sala para aulas de engenharia de software",
  "status": "ACTIVE"
}
```

### Filtros e Paginação

```bash
GET /api/v1/rooms?page=1&limit=10&building=Main&category=CLASSROOM&status=ACTIVE&minCapacity=20&maxCapacity=50
```

## 🧪 Testes

### Estratégia

- **Unitários**: `jest` com `ts-jest`, cobrindo serviços, controllers, guardas, repositórios e o health check. Garantimos ~94% de cobertura mantendo os arquivos de bootstrap e DTOs fora do relatório.
- **End-to-end**: suíte `test/app.e2e-spec.ts` sobe a aplicação completa com Prisma e PostgreSQL (`rooms_test`) e valida todas as rotas CRUD.

### Comandos

```bash
# Testes unitários (dentro ou fora do container rooms)
npm run test

# Testes e2e (usa DB rooms_test; não precisa de túnel, usa o host postgresql do compose)
npm run test:e2e

# Cobertura consolidada dos unitários (IGNORA main.ts, módulos, DTOs e arquivos de bootstrap)
npm run test:cov

# Opcional: rodar tudo em sequência
npm run test && npm run test:e2e
```

> **Dica:** no container Docker copiamos os fontes (`src/`, `test/`, configs) e instalamos `socat`. Assim `docker exec rooms npm run test:e2e` funciona direto sem precisar mapear `localhost`.

## 📈 Integração com SonarQube

O repositório já sobe um container SonarQube via `docker compose up -d sonarqube`. Para enviar métricas do serviço Rooms:

1. Gere um token no Sonar (`Perfil > Security`) e exporte `SONAR_TOKEN=<seu-token>`. Você também pode customizar `SONAR_HOST_URL`, `SONAR_PROJECT_KEY` e `SONAR_PROJECT_NAME` (default `http://localhost:9000`, `constrsw-rooms`, `ConstrSW Rooms Service`).
2. Garanta que o relatório de cobertura existe (`npm run test:cov` gera `coverage/lcov.info`).
3. Execute o scanner:

```bash
SONAR_HOST_URL=http://localhost:9000 \
SONAR_TOKEN=seu_token \
npm run sonar:scan
```

O script usa `sonarqube-scanner` para apontar `src/` como fonte, `src`/`test` como testes e envia o `coverage/lcov.info` para o container SonarQube do projeto.

## 📁 Estrutura do Projeto

```
backend/rooms/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Migrações do Prisma
├── src/
│   ├── main.ts               # Arquivo principal da aplicação
│   ├── app.module.ts         # Módulo raiz
│   ├── modules/
│   │   └── rooms/
│   │       ├── rooms.controller.ts    # Controller de salas
│   │       ├── rooms.service.ts       # Lógica de negócio
│   │       ├── rooms.module.ts        # Módulo de salas
│   │       ├── dto/                   # Data Transfer Objects
│   │       └── furnitures/            # Submódulo de mobílias
│   └── oauth/
│       └── jwt-auth.guard.ts  # Guard de autenticação JWT
├── test/                      # Testes e2e
├── Dockerfile                 # Imagem Docker
├── docker-compose.yml         # Configuração Docker Compose
├── package.json               # Dependências do projeto
├── tsconfig.json              # Configuração TypeScript
├── README.md                  # Este arquivo
└── SWAGGER_GUIDE.md          # Guia do Swagger UI
```

## 🐳 Docker

### Build da Imagem

```bash
docker build -t rooms-api .
```

### Executar Container

```bash
docker run -p 8188:8080 \
  -e DATABASE_URL="postgresql://user:password@host:5432/db" \
  -e OAUTH_VALIDATE_URL="http://oauth:8000/validate" \
  rooms-api
```

### Health Check

```bash
# Via docker-compose (usa curl internamente)
docker compose ps rooms

# Manual
curl http://localhost:8188/
```

## 🔍 Prisma

### Comandos Úteis

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar migração
npx prisma migrate dev --name migration_name

# Visualizar banco de dados (Prisma Studio)
npx prisma studio

# Resetar banco de dados (cuidado!)
npx prisma migrate reset
```

## 📝 Notas de Desenvolvimento

- O serviço **não deve** implementar endpoints de recursos (resources), pois são servidos por outro microserviço
- Use sempre validação de dados com `class-validator`
- Todos os endpoints exigem autenticação, exceto o health check (`/`)
- O Prisma Client é gerado automaticamente no build do Docker

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto faz parte do trabalho acadêmico de Construção de Software - PUCRS.

## 🆘 Suporte

- Documentação: http://localhost:8188/api/v1/docs
- OAuth Service: http://localhost:8180/docs
- Logs: `docker compose logs -f rooms`

---

**Desenvolvido com ❤️ usando NestJS**
