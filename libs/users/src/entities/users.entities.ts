import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLES } from '../constants';
import { IUser } from '../interfaces';
export class UserEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ enum: USER_ROLES, example: USER_ROLES.MANAGER })
  role: USER_ROLES;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;

  @ApiProperty({ example: 1 })
  totalPriceOfSellingProducts: number;

  constructor(user: Partial<IUser>) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.totalPriceOfSellingProducts = user.totalPriceOfSellingProducts;
  }
}
