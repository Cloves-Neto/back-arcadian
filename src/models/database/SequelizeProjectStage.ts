import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { SequelizeProject } from './SequelizeProject';
import { SequelizeProjectStep } from './SequelizeProjectStep';
import { TaskSequelize } from './SequelizeTask';

@Table({
  tableName: 'project_stages',
  timestamps: false,
  underscored: true,
})
export class SequelizeProjectStage extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => SequelizeProject)
  @Column(DataType.UUID)
  project_id?: string;

  @BelongsTo(() => SequelizeProject)
  project?: SequelizeProject;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order!: number;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @HasMany(() => SequelizeProjectStep)
  steps?: SequelizeProjectStep[];

  @HasMany(() => TaskSequelize)
  tasks?: TaskSequelize[];
}
