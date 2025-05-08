import { TaskService } from "./task.service";
import { Task } from "./task.entity";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateTaskInput } from "./dto/create-task.input";
import { UpdateTaskInput } from "./dto/update-task.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guards";
import { Roles } from "src/auth/guards/roles.decorator";

@Resolver(() => Task)
export class TaskResolver{
    constructor(private readonly taskService:TaskService){}

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin','member')
    @Query(()=>[Task])
    findAllTasks(){
        return this.taskService.findAllTasks();
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin','member')
    @Query(()=>Task)
    findTaskById(@Args('id', {type: ()=> Number}) id: number){
        return this.taskService.findOneTask(id);
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Mutation(() => Task)
    createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput): Promise<Task> {
        return this.taskService.createTask(createTaskInput);
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin','member')
    @Mutation(()=>Task)
    updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput, @Context() context): Promise<Task>{
        const user = context.req.user;
        return this.taskService.updateTask(updateTaskInput,user);
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Mutation(()=>Boolean)
    removeTask(@Args('id',{type: ()=> Number}) id: number){
        return this.taskService.removeTask(id);
    }
    
}