import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UtilsModule } from 'libs/utils';
import { UsersLibModule } from 'libs/users';

@Module({
  imports: [UtilsModule, UsersLibModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthLibModule {}
