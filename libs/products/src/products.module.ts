import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ProductManagerModel,
  ProductModel,
  SellingProductModel,
} from './models';
import { ProductsManagerService } from './services';
import { UsersLibModule } from 'libs/users';
import { UtilsModule } from 'libs/utils';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductModel,
      ProductManagerModel,
      SellingProductModel,
    ]),
    UsersLibModule,
    UtilsModule,
  ],
  providers: [ProductsService, ProductsManagerService],
  exports: [ProductsService],
})
export class ProductsLibModule {}
