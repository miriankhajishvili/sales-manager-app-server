import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'libs/users/entities';

export class LoginResponseEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserEntity })
  userData: UserEntity;
}
