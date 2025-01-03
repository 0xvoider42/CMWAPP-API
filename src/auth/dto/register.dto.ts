import * as Joi from 'joi';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  email: string;
  password: string;
  role?: UserRole;
}

export const RegisterSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .default(UserRole.USER)
    .messages({
      'any.only': 'Invalid role selected',
    }),
});
