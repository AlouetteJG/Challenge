import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { UpdateUserInput } from "./dato/update-user.input";

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRespository:Repository<User>,
    ){}

    async createUser(userData: Partial<User>):Promise<User> {
        const user = this.userRespository.create(userData);
        return this.userRespository.save(user);
    }

    async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
        const user = await this.userRespository.preload(updateUserInput);
        if (!user) {
            throw new NotFoundException(`User with ID ${updateUserInput.id} not found`);
        }
        return this.userRespository.save(user);
    }

    async removeUser(id:number):Promise<boolean>{
        const result = await this.userRespository.delete(id);
        if (!result.affected) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        
        return true;    
    }

    async findOneUser(id: number): Promise<User> {
        const user = await this.userRespository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findAllUsers():Promise <User[]>{
        return this.userRespository.find();
    }
    
} 