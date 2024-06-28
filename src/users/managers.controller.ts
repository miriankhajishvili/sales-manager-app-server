import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from 'libs/users/entities';
import { JwtAuthGuard, RolesGuard } from 'libs/common/guards';
import { Roles } from 'libs/common/decorators';
import { USER_ROLES } from 'libs/users/constants';
import { RegisterDto } from 'libs/auth/dtos';
import { AuthService } from 'libs/auth';
import { UpdateManagerDto } from 'libs/users/dtos';
import { UsersService } from 'libs/users';

@Controller('manager')
@ApiTags('manager')
@ApiBearerAuth()
export class ManagersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new manager.' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserEntity,
  })
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async register(
    @Request() req: ExpressRequest,
    @Body() registerDto: RegisterDto,
  ): Promise<UserEntity> {
    return this.authService.registerManager(registerDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a manager.' })
  @ApiResponse({
    status: 201,
    description: 'The manager has been successfully updated.',
    type: UserEntity,
  })
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateMangerDto: UpdateManagerDto,
  ): Promise<UserEntity> {
    return this.usersService.updateUser(+id, updateMangerDto);
  }
}
