import { IsOptional, IsString, IsNumber, Min, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductEntity } from '../entities';

export class QueryDto {
  @ApiProperty({ required: false, description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

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

  @ApiProperty({
    required: false,
    description: 'Sort by field',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    required: false,
    description: 'Sort order',
    default: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}

export class PaginationResponseEntity {
  @ApiProperty({ type: [ProductEntity] })
  products: ProductEntity[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 2, nullable: true })
  nextPage?: number;
}
