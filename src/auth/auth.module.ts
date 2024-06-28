import { Module } from '@nestjs/common';
import { AuthLibModule } from 'libs/auth';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'libs/common/strategies';
import { UsersLibModule } from 'libs/users';

@Module({
  imports: [AuthLibModule, UsersLibModule],
  providers: [JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
