import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ENVS } from 'libs/common/constants';
import {
  ProductManagerModel,
  ProductModel,
  SellingProductModel,
} from 'libs/products/models';
import { UsersModel } from 'libs/users/models/users.models';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get(ENVS.database.type),
        host: configService.get(ENVS.database.host),
        port: configService.get(ENVS.database.port),
        username: configService.get(ENVS.database.user),
        password: configService.get(ENVS.database.password),
        database: configService.get(ENVS.database.name),
        models: [
          UsersModel,
          ProductModel,
          ProductManagerModel,
          SellingProductModel,
        ],
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
