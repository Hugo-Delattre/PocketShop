import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.gard';
import { Public } from './auth/data';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { User } from './user/entities/user.entity';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './auth/dto/login.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginDto,
  })
  @Post('auth/login')
  async login(@Request() req: { user: Omit<User, 'password'> }) {
    return this.authService.login(req.user);
  }

  @ApiBody({
    type: CreateUserDto,
  })
  @Public()
  @Post('auth/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/logout')
  async logout(@Request() req) {
    return req.logout();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
