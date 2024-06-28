import { IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0.01)
  price?: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  managers?: number[];
}
