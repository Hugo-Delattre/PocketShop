import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private async hash(password: string) {
    const salt = await bcrypt.genSalt();

    return await bcrypt.hash(password, salt);
  }

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    //TODO: update this with new user entity
    // user.name = createUserDto.name;
    // user.age = createUserDto.age;
    user.email = createUserDto.email;
    user.first_name = createUserDto.first_name;
    user.last_name = createUserDto.last_name;
    user.username = createUserDto.username;
    user.password = await this.hash(createUserDto.password);

    const newUser = await this.userRepository.save(user);
    delete newUser.password;
    delete newUser.role;
    return newUser;
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  findAllUser(take: number, skip: number): Promise<[User[], number]> {
    return this.userRepository.findAndCount({
      take,
      skip,
    });
  }

  /**
   * this function is used to get one user by its username
   * @returns promise of of a user
   */
  findOne(username: string): Promise<User> {
    const user = this.userRepository.findOneBy({ username });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /**
   * this function is used to get one user by its username
   * @returns promise of of a user with password field
   */
  findOneWithPassword(username: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  async viewUser(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = new User();
    //TODO: update this with new user entity
    // user.name = updateUserDto.name;
    // user.age = updateUserDto.age;
    user.email = updateUserDto.email;
    user.username = updateUserDto.username;
    user.id = id;
    return this.userRepository.save(user);
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }

  countUsers() {
    return this.userRepository.count();
  }

  async getNewUsersOfTheDay(date: Date): Promise<number> {
    return await this.userRepository.count({ where: { creation_date: date } });
  }
}
