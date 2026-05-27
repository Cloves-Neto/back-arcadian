# Skill: Banco de Dados, Migrations e Singleton

Este projeto utiliza **PostgreSQL** via **Sequelize** com a extensão tipada **`sequelize-typescript`**.

## 1. Padrão Singleton de Conexão (`SequelizeSingletonConnection`)
Para garantir uma única instância do banco de dados na aplicação, utilizamos o padrão Singleton. Toda injeção ou uso de `sequelize` deve vir através deste arquivo de configuração:

**`src/config/database.ts`**:
```typescript
import { Sequelize } from "sequelize";

export default class SequelizeSingletonConnection {
  private static SEQUELIZE: Sequelize;
  private constructor() {}

  public static getSequelize(): Sequelize {
    if (!SequelizeSingletonConnection.SEQUELIZE) {
      SequelizeSingletonConnection.SEQUELIZE = SequelizeSingletonConnection.connect();
    }
    return SequelizeSingletonConnection.SEQUELIZE;
  }

  private static connect(): Sequelize {
    const { DATABASE_DIALECT, DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_NAME, SUPABASE_CA_BASE64 } = process.env;
    const connectionString = `${DATABASE_DIALECT}://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
    
    // Injeta certificado SSL (Necessário para Supabase)
    const ca = Buffer.from(SUPABASE_CA_BASE64 as string, 'base64').toString('utf8');

    return new Sequelize(connectionString, {
      dialectOptions: { ssl: { ca } },
      logging: false // Evita floodar o terminal
    });
  }
}
```

## 2. Models (`models/`)
As models obrigatoriamente utilizam decorators de `sequelize-typescript` (`@Table`, `@Column`, `DataType`).
- Deve definir estritamente os campos.
- Não esquecer do `underscored: true` no `@Table`.
- Os campos de timestamp (created_at, updated_at, deleted_at) devem ser explicitamente definidos.

Exemplo de Model:
```typescript
import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'clients', timestamps: true, underscored: true })
export default class ClientModel extends Model<ClientModel> {
    @Column({ type: DataType.UUID, primaryKey: true })
    public id!: string;
    
    @Column
    public name!: string;
}
```

## 3. Regras de Migrations e Sync
- **NUNCA** utilize o comando `sequelize.sync({ force: true })` ou `alter: true` em ambiente de produção (isso é bloqueante e arriscado).
- Todas as alterações estruturais do banco devem ser feitas através de **Migrations**.
- Quando instruído a criar tabelas, gere os arquivos de migração via Sequelize CLI e as defina estritamente em TypeScript.
