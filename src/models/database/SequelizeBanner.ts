import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({
  tableName: 'banners',
  timestamps: true,
  underscored: true,
})
export class BannerSequelize extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column(DataType.TEXT)
  message?: string;

  @Column(DataType.STRING)
  button_text?: string;

  @Column(DataType.STRING)
  button_link?: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'gradient',
  })
  style!: string;

  @Column(DataType.STRING)
  desktop_image?: string;

  @Column(DataType.STRING)
  mobile_image?: string;

  @Column(DataType.STRING)
  tag?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active!: boolean;
}
