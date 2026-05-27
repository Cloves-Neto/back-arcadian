import { Table, Column, Model, DataType, PrimaryKey, Default, HasOne } from 'sequelize-typescript';
import { ProfileSequelize } from './SequelizeProfile';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class UserSequelize extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column(DataType.STRING)
  password?: string;

  @Column({
    type: DataType.ENUM('admin', 'client'),
    defaultValue: 'client',
  })
  role!: 'admin' | 'client';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  must_change_password!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_admin_created!: boolean;

  @Column(DataType.STRING)
  invitation_token?: string;

  @Column(DataType.DATE)
  token_expires_at?: Date;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  privileges!: string[];

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  settings?: any;
}
