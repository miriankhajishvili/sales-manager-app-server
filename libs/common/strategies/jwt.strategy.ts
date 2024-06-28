import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'libs/users';
import { ENVS } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.headers?.['accesstoken'];

          if (!token) {
            return null;
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get(ENVS.accessToken.secret),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user.toJSON();

    return rest;
  }
}
