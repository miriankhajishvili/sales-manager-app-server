import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel, SellingProductModel } from '../models';
import { UsersService } from 'libs/users';
import { UsersModel } from 'libs/users/models';
import {
  CreateProductDto,
  GetSellingProductsDto,
  PaginationResponseEntity,
  QueryDto,
  UpdateProductDto,
} from '../dtos';
import { UserEntity } from 'libs/users/entities';
import { Op } from 'sequelize';
import { USER_ROLES } from 'libs/users/constants';
import { IUser } from 'libs/users/interfaces';
import { ProductsManagerService } from './product-manager.service';
import { ProductStatuses } from '../constants/product-statuses.constants';
import sequelize from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: typeof ProductModel,
    private readonly usersService: UsersService,
    private readonly productManagerService: ProductsManagerService,
    @InjectModel(SellingProductModel)
    private readonly sellingProductModel: typeof SellingProductModel,
  ) {}

  public async createProduct(input: CreateProductDto) {
    const { name, price, quantity } = input;

    try {
      let managers: UsersModel[] = [];
      if (input.managers) {
        managers = await this.usersService.findManagers(input.managers);
      }

      const product = await this.productModel.create({
        name,
        quantity,
        price,
      });

      if (input.managers) {
        await product.$set('managers', managers);
      }

      const productData = product.toJSON();
      productData.managers = managers;

      return productData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating Product');
    }
  }

  public async updateProduct(productId: number, updateData: UpdateProductDto) {
    const { name, price, quantity, managers: managerIds } = updateData;

    try {
      const product = await this.findProductOrThrow(productId);

      if (managerIds) {
        const managers = await this.usersService.findManagers(managerIds);
        await product.$set('managers', managers);
      }

      if (name || price || quantity) {
        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = price;
        if (quantity !== undefined) product.quantity = quantity;

        await product.save();
      }

      const updatedProduct = await this.productModel.findOne({
        where: { id: product.id },
        include: 'managers',
      });
      const productData = updatedProduct.toJSON();

      return {
        ...productData,
        managers: productData.managers.length
          ? productData.managers.map((manager) => new UserEntity(manager))
          : [],
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating product');
    }
  }

  async findProductOrThrow(productId: number) {
    const product = await this.productModel.findOne({
      where: { id: productId, status: ProductStatuses.ACTIVE },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return product;
  }

  public async getProducts(
    query: QueryDto,
    user: IUser,
  ): Promise<PaginationResponseEntity> {
    const {
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'ASC',
    } = query;
    const offset = (page - 1) * limit;

    try {
      const where: any = search ? { name: { [Op.iLike]: `%${search}%` } } : {};

      const include: any[] = [];
      if (user.role === USER_ROLES.MANAGER) {
        include.push({
          model: UsersModel,
          as: 'managers',
          where: { id: user.id },
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'role',
            'createdAt',
            'updatedAt',
          ],
          through: { attributes: [] },
          required: true,
        });
      } else {
        include.push({
          model: UsersModel,
          as: 'managers',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'role',
            'createdAt',
            'updatedAt',
          ],
          through: { attributes: [] },
        });
      }

      // Separate count query for distinct products
      const countResult = await this.productModel.count({
        where: { ...where, status: ProductStatuses.ACTIVE },
        include,
        distinct: true,
        col: 'id',
      });

      // Fetch products with associations
      const rows = await this.productModel.findAll({
        where: { ...where, status: ProductStatuses.ACTIVE },
        limit,
        include,
        offset,
        order: [[sortBy, sortOrder]],
      });

      const totalPages = Math.ceil(countResult / limit);
      const nextPage = page < totalPages ? page + 1 : null;

      // Convert the result to plain objects and include managers
      const products = rows.map((product) => {
        const productData = product.get({ plain: true });
        productData.managers = product.managers;
        return productData;
      });

      return {
        products,
        total: countResult,
        perPage: limit,
        currentPage: page,
        nextPage,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching products');
    }
  }

  async checkProductManager(productId: number, managerId: number) {
    const product = await this.productModel.findOne({
      where: { id: productId, status: ProductStatuses.ACTIVE },
      include: [
        {
          model: UsersModel,
          as: 'managers',
          where: { id: managerId },
          attributes: ['id'],
        },
      ],
    });

    if (!product) {
      throw new NotFoundException('Manager Dont have such product.');
    }

    return product;
  }

  public async sellProduct(
    manger: IUser,
    data: { productId: number; quantity: number },
  ) {
    try {
      const product = await this.checkProductManager(data.productId, manger.id);

      if (product.quantity < data.quantity) {
        throw new ConflictException(
          'The quantity requested exceeds the available product quantity.',
        );
      }

      await this.productModel.update(
        { quantity: product.quantity - data.quantity },
        { where: { id: product.id } },
      );

      const totalAmount = data.quantity * product.price;

      await this.sellingProductModel.create({
        userId: manger.id,
        productId: product.id,
        quantity: data.quantity,
        totalPrice: totalAmount,
      });

      await this.usersService.updateUser(manger.id, {
        totalPriceOfSellingProducts:
          manger.totalPriceOfSellingProducts + totalAmount,
      });

      return { message: 'Sell successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error selling product.');
    }
  }

  public async deleteProduct(productId: number) {
    try {
      await this.findProductOrThrow(productId);
      await this.productModel.update(
        { status: ProductStatuses.DELETED },
        { where: { id: productId } },
      );

      return { message: 'Successfully Delete Product.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting Product');
    }
  }

  public async getSellingProducts(input: GetSellingProductsDto, user: IUser) {
    try {
      const { page = 1, limit = 10 } = input;
      const offset = (page - 1) * limit;

      const { rows, count } = await SellingProductModel.findAndCountAll({
        limit,
        offset,
        where: {
          ...(user.role === USER_ROLES.MANAGER ? { userId: user.id } : {}),
        },
        include: [
          {
            model: ProductModel,
            as: 'product',
            attributes: [],
          },
        ],
        attributes: [
          [
            sequelize.fn('SUM', sequelize.col('SellingProductModel.quantity')),
            'totalQuantity',
          ],
          [
            sequelize.fn(
              'SUM',
              sequelize.col('SellingProductModel.totalPrice'),
            ),
            'totalPrice',
          ],
          [sequelize.literal('"product"."name"'), 'name'],
          [sequelize.literal('"product"."price"'), 'price'],
          [sequelize.literal('"SellingProductModel"."createdAt"'), 'soldAt'],
        ],
        group: [
          'SellingProductModel.productId',
          'product.id',
          'SellingProductModel.createdAt',
        ],
      });

      const allRows = count.length;

      const totalPages = Math.ceil(allRows / limit);
      const nextPage = page < totalPages ? page + 1 : null;

      return {
        sellingProducts: rows,
        total: allRows,
        perPage: limit,
        currentPage: page,
        nextPage,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching selling Product');
    }
  }
}
