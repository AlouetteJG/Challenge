import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
  ) {}

  async createUser(userData: Partial<User>): Promise<User> {
    if (!userData.password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRespository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.userRespository.save(user);
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userRespository.preload(updateUserInput);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${updateUserInput.id} not found`,
      );
    }
    return this.userRespository.save(user);
  }

  async removeUser(id: string): Promise<boolean> {
    const result = await this.userRespository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return true;
  }

  async findOneUser(id: string): Promise<User> {
    const user = await this.userRespository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRespository.findOne({
      where: {
        email,
      },
      select: ['id', 'email', 'password', 'isActive', 'role'],
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRespository.find();
  }
}
