import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript';
import { ContractSequelize } from './SequelizeContract';
import { Installment } from './Installment';

@Table({
  tableName: 'installments',
  timestamps: true,
  underscored: true,
})
export class InstallmentSequelize extends Model<Installment> implements Installment {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ContractSequelize)
  @Column(DataType.UUID)
  contract_id!: string;

  @Column(DataType.INTEGER)
  installment_number!: number;

  @Column(DataType.INTEGER)
  total_installments!: number;

  @Column(DataType.DATE)
  due_date!: Date;

  @Column(DataType.DECIMAL(10, 2))
  value!: number;

  @Column({
    type: DataType.ENUM('pending', 'paid', 'overdue'),
    defaultValue: 'pending',
  })
  status!: 'pending' | 'paid' | 'overdue';

  @Column(DataType.DATE)
  payment_date?: Date;

  @Column(DataType.DECIMAL(10, 2))
  paid_amount?: number;

  @Column(DataType.DATE)
  last_charged_at?: Date;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;
}
