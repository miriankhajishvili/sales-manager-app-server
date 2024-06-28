import { ApiProperty } from '@nestjs/swagger';

export class SellingProductModel {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the selling product',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the associated product',
  })
  productId: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the associated user',
  })
  userId: number;

  @ApiProperty({
    example: 10,
    description: 'The quantity of the selling product',
  })
  quantity: number;

  @ApiProperty({
    example: 100.0,
    description: 'The total price of the selling product',
  })
  totalPrice: number;

  @ApiProperty({
    example: '2023-06-25T00:00:00.000Z',
    description: 'The date when the selling product was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-06-25T00:00:00.000Z',
    description: 'The date when the selling product was last updated',
  })
  updatedAt: Date;
}
