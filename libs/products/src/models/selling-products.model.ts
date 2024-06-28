import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ProductModel } from './products.model';
import { UsersModel } from 'libs/users/models';

@Table({
  tableName: 'selling_products',
})
export class SellingProductModel extends Model<SellingProductModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => ProductModel)
  @Column({
    type: DataType.INTEGER,
  })
  productId: number;

  @ForeignKey(() => UsersModel)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  totalPrice: number;

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

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @BelongsTo(() => UsersModel)
  user: UsersModel;
}
