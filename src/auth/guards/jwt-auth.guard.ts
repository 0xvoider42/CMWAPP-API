import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      // Log the error or user for debugging
      console.log('JwtAuthGuard error:', err);
      console.log('User:', user);
      console.log('Info:', info);
      throw err || new Error('User not found');
    }
    return user;
  }
}
