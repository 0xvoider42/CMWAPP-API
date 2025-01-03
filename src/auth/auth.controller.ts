import { Controller, Post, Body, UsePipes } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { RegisterDto, RegisterSchema } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new JoiValidationPipe(LoginSchema))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @UsePipes(new JoiValidationPipe(RegisterSchema))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
