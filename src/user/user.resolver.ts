import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {User} from './user.entity'
import { UserService } from "./user.service";
import { CreateUserInput } from "./dato/create-user.input";
import { UpdateUserInput } from "./dato/update-user.input";

@Resolver(()=>User)
export class UserResolver{
    constructor(private readonly userService:UserService){}

    @Query(()=>[User])
    findAll() {
        return this.userService.findAll();
    }

    @Query(() => User)
    findUserById(@Args('id', { type: () => Number }) id: number): Promise<User> {
        return this.userService.findOne(id);
    }
    


    @Mutation(()=>User)
    async createUser(
        @Args('data') data: CreateUserInput,
    ): Promise<User>{
        return this.userService.create(data);
    }

    @Mutation(() => User)
    updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        return this.userService.update(updateUserInput);
    }

    @Mutation(() => Boolean)
    removeUser(@Args('id', { type: () => Number }) id: number) {
        return this.userService.remove(id);
    }


}
