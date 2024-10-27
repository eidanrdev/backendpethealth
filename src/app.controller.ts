import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/auth/jwt-auth.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedData() {
    return {
      email: "eidan@icloud.com",
    };
  }

  @Get('public')
  getPublicData() {
    return { message: 'Esta ruta es publica' };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}