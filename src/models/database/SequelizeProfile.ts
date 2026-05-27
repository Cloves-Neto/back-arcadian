import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserSequelize } from './SequelizeUser';

@Table({
  tableName: 'profiles',
  timestamps: true,
  underscored: true,
})
export class ProfileSequelize extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => UserSequelize)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  user_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name!: string;

  @Column(DataType.STRING)
  avatar_url?: string;

  @Column(DataType.STRING)
  phone?: string;

  @Column(DataType.STRING)
  tax_id?: string;

  @Column(DataType.TEXT)
  address?: string;

  @Column(DataType.STRING)
  cep?: string;

  @Column(DataType.STRING)
  street?: string;

  @Column(DataType.STRING)
  number?: string;

  @Column(DataType.STRING)
  complement?: string;

  @Column(DataType.STRING)
  neighborhood?: string;

  @Column(DataType.STRING)
  city?: string;

  @Column(DataType.STRING)
  state?: string;

  @Column(DataType.STRING)
  instagram?: string;

  @Column(DataType.STRING)
  website?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  onboarding!: boolean;

}
