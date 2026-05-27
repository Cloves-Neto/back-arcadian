import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Subscription } from './Subscription';

@Table({
  tableName: 'subscriptions',
  timestamps: true,
  underscored: true,
})
export class SubscriptionSequelize extends Model<Subscription> implements Subscription {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.DECIMAL(10, 2))
  monthly_price!: number;

  @Column(DataType.DECIMAL(10, 2))
  quarterly_price!: number;

  @Column(DataType.DECIMAL(10, 2))
  semi_annual_price!: number;

  @Column(DataType.DECIMAL(10, 2))
  annual_price!: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;
}
