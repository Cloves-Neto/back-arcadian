import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ClientSequelize } from './SequelizeClient';

@Table({
  tableName: 'notifications',
  timestamps: true,
  underscored: true,
})
export class NotificationSequelize extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ClientSequelize)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  client_id?: string;

  @BelongsTo(() => ClientSequelize)
  client?: ClientSequelize;

  @Column({
    type: DataType.STRING,
    defaultValue: 'lucide:bell',
  })
  icon!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  read_status!: boolean;

  @Column({
    type: DataType.STRING,
    defaultValue: 'push',
  })
  type!: string;
}
