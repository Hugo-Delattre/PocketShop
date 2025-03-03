import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import type { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOneWithPassword(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await compare(pass, user.password);

    if (user && isMatch) {
      return user;
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  decode(token: string): JwtPayload {
    const decode = this.jwtService.decode(token);
    const payload: JwtPayload = JSON.parse(JSON.stringify(decode));
    return payload;
  }
  async findPayloadUser(payload: JwtPayload) {
    return this.userService.findOneById(payload.sub);
  }

  verify(token: string): boolean {
    try {
      this.jwtService.verify(token);
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }
}
