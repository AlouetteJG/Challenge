import { TaskService } from "./task.service";
import { Task } from "./task.entity";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateTaskInput } from "./tasks/create-task.input";
import { UpdateTaskInput } from "./tasks/update-task.input";

@Resolver(() => Task)
export class TaskResolver{
    constructor(private readonly taskService:TaskService){}

    @Query(()=>[Task])
    findAllTasks(){
        return this.taskService.findAllTasks();
    }

    @Query(()=>Task)
    findTaskById(@Args('id', {type: ()=> Number}) id: number){
        return this.taskService.findOneTask(id);
    }


    @Mutation(() => Task)
    createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput): Promise<Task> {
        return this.taskService.createTask(createTaskInput);
    }

    @Mutation(()=>Task)
    updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput){
        return this.taskService.updateTask(updateTaskInput);
    }

    @Mutation(()=>Boolean)
    removeTask(@Args('id',{type: ()=> Number}) id: number){
        return this.taskService.removeTask(id);
    }
    
}