import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript';
import { ContractSequelize } from './SequelizeContract';
import { ServiceSequelize } from './SequelizeService';
import { SubscriptionSequelize } from './SequelizeSubscription';

export interface ContractItem {
  id?: string;
  contract_id: string;
  item_type: 'service' | 'subscription';
  service_id?: string;
  subscription_id?: string;
  price: number;
}

@Table({
  tableName: 'contract_items',
  timestamps: true, // Reativado agora que a coluna updated_at foi adicionada ao BD
  underscored: true,
})
export class ContractItemSequelize extends Model<ContractItem> implements ContractItem {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ContractSequelize)
  @Column(DataType.UUID)
  contract_id!: string;

  @Column(DataType.STRING)
  item_type!: 'service' | 'subscription';

  @ForeignKey(() => ServiceSequelize)
  @Column(DataType.UUID)
  service_id?: string;


  @ForeignKey(() => SubscriptionSequelize)
  @Column(DataType.UUID)
  subscription_id?: string;

  @Column(DataType.DECIMAL(10, 2))
  price!: number;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;
}
