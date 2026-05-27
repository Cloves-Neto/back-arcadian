import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { TaskSequelize } from './SequelizeTask';

@Table({
  tableName: 'task_todos',
  timestamps: false,
  underscored: true,
})
export class SequelizeTaskTodo extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => TaskSequelize)
  @Column(DataType.UUID)
  task_id?: string;

  @BelongsTo(() => TaskSequelize)
  task?: TaskSequelize;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_completed!: boolean;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;
}
