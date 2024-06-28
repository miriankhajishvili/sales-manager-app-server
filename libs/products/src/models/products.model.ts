import { UsersModel } from 'libs/users/models';
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { ProductManagerModel } from './product-manager.model';
import { ProductStatuses } from '../constants/product-statuses.constants';
import { SellingProductModel } from './selling-products.model';

@Table({
  tableName: 'products',
})
export class ProductModel extends Model<ProductModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.ENUM(...Object.values(ProductStatuses)),
    allowNull: false,
    defaultValue: ProductStatuses.ACTIVE,
  })
  status: ProductStatuses;

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

  @BelongsToMany(() => UsersModel, { through: () => ProductManagerModel })
  managers: UsersModel[];

  @HasMany(() => SellingProductModel)
  sellingProducts: SellingProductModel[];
}
