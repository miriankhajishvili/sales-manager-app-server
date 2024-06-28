import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { ProductModel } from './products.model';
import { UsersModel } from 'libs/users/models';

@Table({
  tableName: 'product_managers',
})
export class ProductManagerModel extends Model<ProductManagerModel> {
  @ForeignKey(() => ProductModel)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  productId: number;

  @ForeignKey(() => UsersModel)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  userId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;
}
