import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetSellingProductsDto {
  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    required: false,
    description: 'Number of items per page',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}

export class SellingProductDto {
  @ApiProperty({ example: 100 })
  totalQuantity: number;

  @ApiProperty({ example: 100 })
  totalPrice: number;

  @ApiProperty({ example: 20 })
  price: number;

  @ApiProperty()
  soldAt: string;

  @ApiProperty()
  name: string;
}

export class PaginationSellingProductsResponseEntity {
  @ApiProperty({ type: [SellingProductDto] })
  products: SellingProductDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 2, nullable: true })
  nextPage?: number;
}
