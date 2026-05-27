import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ProfileSequelize } from './SequelizeProfile';

@Table({
  tableName: 'clients',
  timestamps: true,
  underscored: true,
})
export class ClientSequelize extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ProfileSequelize)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  profile_id!: string;

  @Column(DataType.STRING)
  company_name?: string;

  @Column(DataType.STRING)
  company_category?: string;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  service_ids!: string[];

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  package_ids!: string[];

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  badges!: string[];

}
