import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserSequelize } from './SequelizeUser';

@Table({
  tableName: 'activity_logs',
  timestamps: true, // created_at, updated_at
  underscored: true,
})
export class ActivityLogSequelize extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => UserSequelize)
  @Column(DataType.UUID)
  user_id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  action!: string;

  @Column({
    type: DataType.JSONB,
  })
  metadata?: any;

  @Column(DataType.STRING)
  ip_address?: string;

  @BelongsTo(() => UserSequelize)
  user?: UserSequelize;
}
