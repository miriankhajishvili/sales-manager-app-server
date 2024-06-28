import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'libs/users';
import { UsersModel } from 'libs/users/models/users.models';
import { Request as ExpressRequest } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from 'libs/users/entities';
import { JwtAuthGuard, RolesGuard } from 'libs/common/guards';
import { GetManagersDto } from 'libs/users/dtos';
import { Roles } from 'libs/common/decorators';
import { USER_ROLES } from 'libs/users/constants';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'User Info.' })
  @ApiResponse({
    type: UserEntity,
  })
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req: ExpressRequest): Promise<UsersModel> {
    return req['user'];
  }

  @Get('managers')
  @ApiOperation({
    summary: 'Get managers with pagination, search, and filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Return managers with pagination, search, and filters',
    type: [UsersModel],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getManagers(@Query() query: GetManagersDto) {
    return this.userService.getManagers(query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Manager' })
  @ApiResponse({
    status: 201,
    description: 'The manger has been successfully deleted.',
  })
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.deleteManager(+id);
  }
}
