import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductManagerModel } from '../models';

@Injectable()
export class ProductsManagerService {
  constructor(
    @InjectModel(ProductManagerModel)
    private readonly productManagerModel: typeof ProductManagerModel,
  ) {}

  public create(input: {
    productId: number;
    userId: number;
    quantity: number;
    totalAmount: number;
  }) {
    return this.productManagerModel.create(input);
  }
}
