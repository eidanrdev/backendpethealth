import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  async login(user: { email: string; password: string }) {
    const validatedUser = await this.validateUser(user.email, user.password);

    const payload = { 
      email: validatedUser.email, 
      sub: validatedUser.id, 
      role: validatedUser.role  
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: { 
        id: validatedUser.id,
        email: validatedUser.email,
        role: validatedUser.role 
      },
    };
  }
}
