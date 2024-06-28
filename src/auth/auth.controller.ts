import { Body, Controller } from '@nestjs/common';
import { AuthService } from 'libs/auth';
import { Post } from '@nestjs/common';
import { LoginDto } from 'libs/auth/dtos';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseEntity } from 'libs/auth/entitites';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: LoginResponseEntity,
    schema: { example: { accessToken: 'token' } },
  })
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
