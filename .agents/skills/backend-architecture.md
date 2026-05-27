# Skill: Arquitetura e Padrões de Projeto

O backend utiliza uma arquitetura baseada em tipos de arquivo na raiz, com as funcionalidades distribuídas por domínios (`usecase`). A abordagem mistura conceitos de MSC (Model-Service-Controller) e Clean Architecture.

## Estrutura Base de Pastas
A raiz do backend (`src/`) deve conter as seguintes pastas principais:
- `models/`: Definições das entidades de banco de dados (`sequelize-typescript`).
- `routes/`: Arquivos que definem as rotas da API, importando os Controllers e repassando para o Express.
- `middlewares/`: Middlewares globais e de rotas (validações, auth, erros).
- `utils/`: Funções utilitárias e helpers genéricos.
- `config/`: Configurações do sistema (variáveis de ambiente, singleton do banco).
- `usecase/`: Onde reside toda a lógica de negócios, agrupada por domínio e operação.

## O Padrão `usecase/` (Domínios e Operações)
A regra de ouro é: **Todo fluxo de negócio fica dentro de usecase**.
Exemplo de hierarquia: `/usecase/<dominio>/<operacao>/`.
Ex: `/usecase/client/create/`

Dentro de cada operação, você **DEVE** separar em 3 camadas:
1. `controller/`
2. `service/`
3. `repository/`

### 1. Controller (`ClientCreateController.ts`)
O Controller é apenas o ponto de entrada da requisição. Ele **não** possui regras de negócio.
- O construtor recebe a Service Interface, mas a inicializa internamente injetando a `ServiceImpl`.
- Recebe a `Request` do Express, extrai o payload, repassa para a `service` e devolve a `Response`.

### 2. Service (`ClientCreateService.ts` e `ClientCreateServiceImpl.ts`)
- **Interface (`ClientCreateService.ts`)**: Define o contrato (métodos e retornos) que a implementação deve cumprir.
- **Implementação (`ClientCreateServiceImpl.ts`)**: É onde a mágica acontece. Instancia o Repository, aplica regras de negócio, formata os dados e chama o banco de dados. Envolve tudo em blocos `try/catch`.

### 3. Repository (`ClientCreateRepository.ts`)
A única camada com autorização para acessar o banco de dados via Raw Queries ou métodos diretos da model, mas focando em **Raw Queries parametrizadas** com o Singleton de Conexão quando necessário, ou usando a estrutura orientada.

**Exemplo estrito de Repository (Raw Query)**:
```typescript
import SequelizeSinglentonConnection from '../../config/database'
import type {ClientModel} from '../../models/Client'

export default class ClientCreateRepository {
   async create(client: ClientModel): Promise<ClientModel> {
      const sequelize = SequelizeSinglentonConnection.getSequelize();
      const query = this.buildQuery();
      const replacements = this.buildReplacements(client);
      // executa raw query via sequelize.query(query, { replacements })
   }

   private buildQuery(): string {
       return `INSERT INTO public.clients(...) VALUES (...)`;
   }
   private buildReplacements(client: ClientModel): Object {
       return { name: client.name, ... };
   }
}
```

## Rotas (`routes/ClientRoutes.ts`)
A Rota instancia o Controller uma única vez e utiliza o `bind` para manter o escopo do `this`.
```typescript
import ClientCreateController from '../usecase/client/create/controller/ClientCreateController';
const clientCreateController = new ClientCreateController();
const router = express.Router();
router.post('/client', clientCreateController.handle.bind(clientCreateController));
```
