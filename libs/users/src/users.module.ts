import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from './models';
import { UtilsModule } from 'libs/utils';

@Module({
  imports: [UtilsModule, SequelizeModule.forFeature([UsersModel])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersLibModule {}
