import { Controller, Post, UseGuards, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guards/auth/local-auth.guard';
import { CreateUsersDto } from '../users/dto/create-users.dto';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}