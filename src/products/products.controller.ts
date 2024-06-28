import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  Get,
  Query,
  Request,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'libs/common/decorators';
import { JwtAuthGuard, RolesGuard } from 'libs/common/guards';
import { ProductsService } from 'libs/products';
import {
  CreateProductDto,
  GetSellingProductsDto,
  PaginationResponseEntity,
  PaginationSellingProductsResponseEntity,
  QueryDto,
  SellProductDto,
  UpdateProductDto,
} from 'libs/products/dtos';
import { ProductEntity } from 'libs/products/entities';
import { USER_ROLES } from 'libs/users/constants';
import { Request as ExpressRequest } from 'express';
import { IUser } from 'libs/users/interfaces';

@Controller('products')
@ApiTags('products')
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: ProductEntity,
  })
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productsService.createProduct(createProductDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully updated.',
    type: ProductEntity,
  })
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productsService.updateProduct(+id, updateProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get products with pagination, filtering, sorting, and search',
  })
  @ApiResponse({
    status: 200,
    description:
      'Return products with pagination, filtering, sorting, and search',
    type: PaginationResponseEntity,
  })
  @UseGuards(JwtAuthGuard)
  async getProducts(@Request() req: ExpressRequest, @Query() query: QueryDto) {
    return this.productsService.getProducts(query, req['user']);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sell/:id')
  @ApiOperation({ summary: 'Sell a product' })
  @ApiResponse({ status: 200, description: 'Product sold successfully' })
  @ApiResponse({
    status: 409,
    description:
      'Conflict: The quantity requested exceeds the available product quantity',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Product or manager not found',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sellProduct(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() sellProductDto: SellProductDto,
  ): Promise<{ message: string }> {
    const manager = req['user'] as IUser;
    return this.productsService.sellProduct(manager, {
      productId: id,
      ...sellProductDto,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully deleted.',
  })
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    return this.productsService.deleteProduct(+id);
  }

  @Get('sold')
  @ApiOperation({
    summary: 'Get selling products with pagination.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return products with pagination.',
    type: PaginationSellingProductsResponseEntity,
  })
  @UseGuards(JwtAuthGuard)
  async getSellingProducts(
    @Query() input: GetSellingProductsDto,
    @Req() req: Request,
  ) {
    const manager = req['user'] as IUser;
    return this.productsService.getSellingProducts(input, manager);
  }
}
