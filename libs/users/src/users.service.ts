import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from './models/users.models';
import { IUser } from './interfaces';
import { USER_ROLES } from './constants';
import { GetManagersDto } from './dtos';
import { Op } from 'sequelize';
import { HASH_SERVICE_TOKEN } from 'libs/utils/constants';
import { IHashService } from 'libs/utils/interfaces';
import { UserEntity } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel)
    private readonly userModel: typeof UsersModel,
    @Inject(HASH_SERVICE_TOKEN) private readonly hashService: IHashService,
  ) {}

  async findOne(id: number): Promise<UsersModel> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<UsersModel> {
    return this.userModel.findOne({
      where: {
        email,
      },
    });
  }

  async updateUser(
    id: number,
    updateData: Partial<UsersModel>,
  ): Promise<UserEntity> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.findByEmail(updateData.email);
      if (existingUser) {
        throw new ConflictException(
          `Email ${updateData.email} is already in use`,
        );
      }
    }

    if (updateData.password) {
      const hashedPassword = await this.hashService.hash(updateData.password);
      updateData.password = hashedPassword;
    }

    try {
      await this.userModel.update(updateData, {
        where: { id },
      });
      const updatedUser = await this.userModel.findByPk(id);

      return new UserEntity(updatedUser.toJSON());
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async create(user: Partial<IUser>): Promise<UsersModel> {
    return this.userModel.create(user);
  }

  async findManagers(ids: number[]): Promise<UsersModel[]> {
    const managers = await this.userModel.findAll({
      where: {
        id: ids,
        role: USER_ROLES.MANAGER,
      },
    });

    const foundIds = managers.map((manager) => manager.id);
    const notFoundIds = ids.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      throw new NotFoundException(
        `Managers with IDs ${notFoundIds.join(', ')} not found`,
      );
    }

    return managers;
  }

  async deleteManager(id: number) {
    try {
      const manager = await this.findOne(id);
      if (!manager) {
        throw new NotFoundException('Manager does not exist.');
      }

      await this.userModel.destroy({ where: { id } });

      return { message: 'Successfully delete manager.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting Manger');
    }
  }

  async getManagers(query: GetManagersDto) {
    const {
      firstNameSearch,
      lastNameSearch,
      page = 1,
      limit = 10,
      registrationDateFrom,
      registrationDateTo,
      totalPriceMax,
      totalPriceMin,
    } = query;
    const offset = (page - 1) * limit;

    try {
      const where: any = { role: USER_ROLES.MANAGER };

      if (firstNameSearch || lastNameSearch) {
        const searchConditions: any[] = [];
        if (firstNameSearch) {
          searchConditions.push({
            firstName: { [Op.iLike]: `%${firstNameSearch}%` },
          });
        }
        if (lastNameSearch) {
          searchConditions.push({
            lastName: { [Op.iLike]: `%${lastNameSearch}%` },
          });
        }
        console.log('searchConditions', searchConditions);
        if (searchConditions.length > 0) {
          where[Op.and] = searchConditions;
        }
      }

      if (registrationDateTo || registrationDateFrom) {
        if (registrationDateFrom) {
          where.createdAt = { [Op.gte]: registrationDateFrom };
        }
        if (registrationDateTo) {
          where.createdAt = where.createdAt || {};
          where.createdAt[Op.lte] = registrationDateTo;
        }
      }

      if (totalPriceMax || totalPriceMin) {
        if (totalPriceMin !== undefined) {
          where.totalPriceOfSellingProducts = { [Op.gte]: totalPriceMin };
        }
        if (totalPriceMax !== undefined) {
          where.totalPriceOfSellingProducts =
            where.totalPriceOfSellingProducts || {};
          where.totalPriceOfSellingProducts[Op.lte] = totalPriceMax;
        }
      }

      const { rows, count } = await this.userModel.findAndCountAll({
        where,
        limit,
        offset,
        attributes: { exclude: ['password'] },
      });

      const totalPages = Math.ceil(count / limit);
      const nextPage = page < totalPages ? page + 1 : null;

      return {
        managers: rows,
        total: count,
        perPage: limit,
        currentPage: page,
        nextPage,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching managers');
    }
  }
}
