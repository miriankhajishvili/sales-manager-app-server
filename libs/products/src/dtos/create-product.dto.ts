import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  managers?: number[];
}
