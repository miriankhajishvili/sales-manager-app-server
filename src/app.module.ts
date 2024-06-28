import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'libs/database';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProductsModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
