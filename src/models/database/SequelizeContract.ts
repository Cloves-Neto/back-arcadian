import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript';
import { ClientSequelize } from './SequelizeClient';
import { Contract } from './Contract';

@Table({
  tableName: 'contracts',
  timestamps: true,
  underscored: true,
})
export class ContractSequelize extends Model<Contract> implements Contract {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ClientSequelize)
  @Column(DataType.UUID)
  client_id!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.DECIMAL(10, 2))
  total_value!: number;

  @Column(DataType.DECIMAL(10, 2))
  upfront_value!: number;

  @Column(DataType.INTEGER)
  installments_count!: number;

  @Column(DataType.DECIMAL(10, 2))
  installment_value!: number;

  @Column({
    type: DataType.STRING,
    defaultValue: 'active',
  })
  status!: 'active' | 'pending' | 'completed' | 'cancelled';

  @Column({
    type: DataType.ENUM('monthly', 'quarterly', 'semi-annual', 'annual'),
    defaultValue: 'monthly',
  })
  billing_frequency!: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';

  @Column(DataType.INTEGER)
  billing_day!: number;

  @Column(DataType.DATE)
  start_date!: Date;

  @Column(DataType.DECIMAL(10, 2))
  setup_amount!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  has_interest!: boolean;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  interest_rate!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 2.0,
  })
  late_fee_percent!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 1.0,
  })
  monthly_interest_percent!: number;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  service_ids!: string[];


  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  upfront_paid!: boolean;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;
}
