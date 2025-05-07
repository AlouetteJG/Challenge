import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import {User} from './user.entity'
import { UserService } from "./user.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { TaskService } from "src/task/task.service";
import { Task } from "src/task/task.entity";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guards";
import { Roles } from "src/auth/guards/roles.decorator";

@Resolver(()=>User)
export class UserResolver{
    constructor(
        private readonly userService:UserService,
        private readonly taskService:TaskService,
    ){}

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Query(()=>[User])
    findAllUsers() {
        return this.userService.findAllUsers();
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Query(() => User)
    findUserById(@Args('id', { type: () => Number }) id: number): Promise<User> {
        return this.userService.findOneUser(id);
    }

    @ResolveField(() => [Task])
    async tasks(@Parent() user: User): Promise<Task[]> {
    return this.taskService.findByAssignedId(user.id);
    }
    


    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Mutation(()=>User)
    createUser(@Args('data') data: CreateUserInput,): Promise<User>{
        return this.userService.createUser(data);
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Mutation(() => User)
    updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        return this.userService.updateUser(updateUserInput);
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Mutation(() => Boolean)
    removeUser(@Args('id', { type: () => Number }) id: number) {
        return this.userService.removeUser(id);
    }


}
