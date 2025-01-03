import * as Joi from 'joi';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  email: string;
  password: string;
  role?: UserRole;
}

export const CreateUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .default(UserRole.USER),
});
