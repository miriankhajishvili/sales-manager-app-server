import { Module } from '@nestjs/common';
import { ProductsLibModule } from 'libs/products';
import { ProductsController } from './products.controller';
import { UsersLibModule } from 'libs/users';
import { JwtStrategy } from 'libs/common/strategies';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductManagerModel, ProductModel } from 'libs/products/models';

@Module({
  imports: [
    ProductsLibModule,
    UsersLibModule,
    SequelizeModule.forFeature([ProductModel, ProductManagerModel]),
  ],
  providers: [JwtStrategy],
  controllers: [ProductsController],
})
export class ProductsModule {}
