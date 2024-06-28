import { USER_ROLES } from '../constants';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: USER_ROLES;
  totalPriceOfSellingProducts?: number;
  createdAt: Date;
  updatedAt: Date;
}
