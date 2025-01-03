import { Injectable } from '@nestjs/common';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<User | undefined> {
    return User.query().findOne({ email });
  }

  async findById(id: number): Promise<User | undefined> {
    return User.query().findById(id);
  }

  async create(
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    return User.query().insert({
      email,
      password,
      role,
    });
  }

  async updateUser(id: number, data: Partial<Omit<User, 'id'>>): Promise<User> {
    return User.query().patchAndFetchById(id, data);
  }
}
