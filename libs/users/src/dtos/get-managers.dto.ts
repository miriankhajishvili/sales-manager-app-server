import { IsOptional, IsString, IsNumber, IsDate, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetManagersDto {
  @ApiProperty({
    required: false,
    description: 'Search term for firstNameSearch',
  })
  @IsOptional()
  @IsString()
  firstNameSearch?: string;

  @ApiProperty({
    required: false,
    description: 'Search term for lastNameSearch',
  })
  @IsOptional()
  @IsString()
  lastNameSearch?: string;

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

  @ApiProperty({ required: false, description: 'Registration date from' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  registrationDateFrom?: Date;

  @ApiProperty({ required: false, description: 'Registration date to' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  registrationDateTo?: Date;

  @ApiProperty({
    required: false,
    description: 'Minimum total price of selling products',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalPriceMin?: number;

  @ApiProperty({
    required: false,
    description: 'Maximum total price of selling products',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalPriceMax?: number;
}
