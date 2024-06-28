import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from 'libs/users';
import { UsersModel } from 'libs/users/models/users.models';
import { UserController } from './users.controller';
import { ManagersController } from './managers.controller';
import { AuthLibModule } from 'libs/auth';
import { UtilsModule } from 'libs/utils';

@Module({
  imports: [
    SequelizeModule.forFeature([UsersModel]),
    AuthLibModule,
    UtilsModule,
  ],
  providers: [UsersService],
  controllers: [UserController, ManagersController],
})
export class UsersModule {}
