import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'libs/users';
import { USER_ROLES } from 'libs/users/constants';
import { HASH_SERVICE_TOKEN, TOKENS_SERVICE_TOKEN } from 'libs/utils/constants';
import { IHashService, ITokenService } from 'libs/utils/interfaces';
import { RegisterDto } from './dtos';
import { UserEntity } from 'libs/users/entities';
import { ConfigService } from '@nestjs/config';
import { ENVS } from 'libs/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(HASH_SERVICE_TOKEN) private readonly hashService: IHashService,
    @Inject(TOKENS_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly configService: ConfigService,
  ) {}

  async registerManager(user: RegisterDto): Promise<UserEntity> {
    try {
      const existingUser = await this.usersService.findByEmail(user.email);

      if (existingUser) {
        throw new BadRequestException(
          'User already registered with this email.',
        );
      }

      const hashedPassword = await this.hashService.hash(user.password);
      const newUser = await this.usersService.create({
        ...user,
        role: USER_ROLES.MANAGER,
        password: hashedPassword,
        totalPriceOfSellingProducts: 0,
      });

      return new UserEntity(newUser);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error registering user.');
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; userData: UserEntity }> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const isPasswordValid = await this.hashService.compare(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const payload = { userId: user.id, email: user.email, role: user.role };
      const accessSecret = this.configService.get(ENVS.accessToken.secret);
      const expiresIn = this.configService.get(ENVS.accessToken.expireIn);
      const accessToken = await this.tokenService.signToken(payload, {
        secret: accessSecret,
        expiresIn: expiresIn,
      });

      return { accessToken, userData: new UserEntity(user) };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during login.');
    }
  }
}
