import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { SequelizeProjectStage } from './SequelizeProjectStage';
import { TaskSequelize } from './SequelizeTask';

@Table({
  tableName: 'project_steps',
  timestamps: false,
  underscored: true,
})
export class SequelizeProjectStep extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => SequelizeProjectStage)
  @Column(DataType.UUID)
  stage_id?: string;

  @BelongsTo(() => SequelizeProjectStage)
  stage?: SequelizeProjectStage;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  order!: number;

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

  @HasMany(() => TaskSequelize)
  tasks?: TaskSequelize[];
}
