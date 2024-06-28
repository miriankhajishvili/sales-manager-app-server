import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'libs/users/entities';

export class ProductEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Product Name' })
  name: string;

  @ApiProperty({ example: 10.99 })
  price: number;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;

  @ApiProperty({ type: [UserEntity], required: false })
  managers?: UserEntity[];
}
