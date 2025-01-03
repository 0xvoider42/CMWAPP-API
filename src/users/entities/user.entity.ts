import { Model } from 'objection';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export class User extends Model {
  static tableName = 'users';

  id!: number;
  email!: string;
  password!: string;
  role!: UserRole;
  created_at!: Date;
  updated_at!: Date;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password', 'role'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        role: { type: 'string', enum: Object.values(UserRole) },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  async $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async $beforeUpdate() {
    this.updated_at = new Date();
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
