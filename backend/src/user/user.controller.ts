import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/data';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from './entities/user.entity';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return this.userService.findAllUser(take, skip, search, sort);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.viewUser(id);
  }

  @Patch('/profile')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userService.updateUserProfile(req.user.userId, updateUserDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.userService.updateUser(id, updateUserDto, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }
}
