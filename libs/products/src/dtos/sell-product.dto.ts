import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SellProductDto {
  @ApiProperty({ example: 10, description: 'Quantity of the product to sell' })
  @IsInt()
  @Min(1)
  quantity: number;
}
