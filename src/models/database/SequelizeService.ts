import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Service } from './Service';

@Table({
  tableName: 'services',
  timestamps: true,
  underscored: true,
})
export class ServiceSequelize extends Model<Service> implements Service {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.DECIMAL(10, 2))
  base_price!: number;

  @Column(DataType.STRING)
  category!: string;

  @Column(DataType.DECIMAL(10, 2))
  upfront_price!: number;

  @Column(DataType.INTEGER)
  installments!: number;

  @CreatedAt
  created_at!: string;

  @UpdatedAt
  updated_at!: string;
}
