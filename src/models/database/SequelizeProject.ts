import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { ContractSequelize } from './SequelizeContract';
import { SequelizeProjectStage } from './SequelizeProjectStage';

@Table({
  tableName: 'projects',
  timestamps: true,
  underscored: true,
})
export class SequelizeProject extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ContractSequelize)
  @Column(DataType.UUID)
  contract_id?: string;

  @BelongsTo(() => ContractSequelize)
  contract?: ContractSequelize;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: 'Briefing',
  })
  status!: string;

  @Column({
    type: DataType.DECIMAL,
    defaultValue: 0,
  })
  progress!: number;

  @Column(DataType.DATE)
  start_date?: Date;

  @Column(DataType.DATE)
  end_date?: Date;

  @HasMany(() => SequelizeProjectStage)
  stages?: SequelizeProjectStage[];
}
