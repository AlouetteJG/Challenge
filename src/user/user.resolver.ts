import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import {User} from './user.entity'
import { UserService } from "./user.service";
import { CreateUserInput } from "./dato/create-user.input";
import { UpdateUserInput } from "./dato/update-user.input";
import { TaskService } from "src/task/task.service";
import { Task } from "src/task/task.entity";

@Resolver(()=>User)
export class UserResolver{
    constructor(
        private readonly userService:UserService,
        private readonly taskService:TaskService,
    ){}

    @Query(()=>[User])
    findAllUsers() {
        return this.userService.findAllUsers();
    }

    @Query(() => User)
    findUserById(@Args('id', { type: () => Number }) id: number): Promise<User> {
        return this.userService.findOneUser(id);
    }

    @ResolveField(() => [Task])
    async tasks(@Parent() user: User): Promise<Task[]> {
    return this.taskService.findByAssignedId(user.id);
    }
    


    @Mutation(()=>User)
    createUser(@Args('data') data: CreateUserInput,): Promise<User>{
        return this.userService.createUser(data);
    }

    @Mutation(() => User)
    updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        return this.userService.updateUser(updateUserInput);
    }

    @Mutation(() => Boolean)
    removeUser(@Args('id', { type: () => Number }) id: number) {
        return this.userService.removeUser(id);
    }


}
