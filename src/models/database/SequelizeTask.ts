import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { SequelizeProjectStep } from './SequelizeProjectStep';
import { SequelizeProjectStage } from './SequelizeProjectStage';
import { SequelizeTaskTodo } from './SequelizeTaskTodo';

@Table({
  tableName: 'tasks',
  timestamps: true,
  underscored: true,
})
export class TaskSequelize extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => SequelizeProjectStep)
  @Column(DataType.UUID)
  project_step_id?: string;

  @BelongsTo(() => SequelizeProjectStep)
  step?: SequelizeProjectStep;

  @ForeignKey(() => SequelizeProjectStage)
  @Column(DataType.UUID)
  stage_id?: string;

  @BelongsTo(() => SequelizeProjectStage)
  stage?: SequelizeProjectStage;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: string;

  @Column(DataType.DATE)
  due_date?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  progress_percentage!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sprint_info?: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  order!: number;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  attachments?: any;

  @HasMany(() => SequelizeTaskTodo)
  todos?: SequelizeTaskTodo[];
}

