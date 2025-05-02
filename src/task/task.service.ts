import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "./task.entity";
import { UpdateTaskInput } from "./tasks/update-task.input";
import { CreateTaskInput } from "./tasks/create-task.input";
import { User } from "src/user/user.entity";

@Injectable()
export class TaskService{
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository:Repository<Task>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async createTask(createTaskInput: CreateTaskInput): Promise<Task> {
        const user = await this.userRepository.findOneBy({ id: createTaskInput.assignedId });
        if (!user) throw new NotFoundException('Assigned user not found');
    
        const task = this.taskRepository.create({
        title: createTaskInput.title,
        description: createTaskInput.description,
        status: createTaskInput.status,
        assigned: user,
    }); 
        return this.taskRepository.save(task);
    }

    async updateTask(updateTaskInput: UpdateTaskInput):Promise<Task>{
        const task = await this.taskRepository.preload(updateTaskInput);
        if (!task) {
            throw new NotFoundException(`User with ID ${updateTaskInput.id} not found`);
        }
        if (updateTaskInput.assignedId) {
            const user = await this.userRepository.findOne({
                where: { id: updateTaskInput.assignedId },
            });
            if (!user) {
                throw new NotFoundException(`User with ID ${updateTaskInput.assignedId} not found`);
            }
            task.assigned = user;
        }
        return this.taskRepository.save(task);
    }

    async removeTask(id:number):Promise<boolean>{
        const result = await this.taskRepository.delete(id);
        if (!result.affected) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return true;
    }   

    async findOneTask(id:number):Promise<Task>{
        const task = await this.taskRepository.findOneBy({id});
        if (!task) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return task;
    }

    async findAllTasks():Promise<Task[]>{
        return this.taskRepository.find();
    }

    async findByAssignedId(userId: number): Promise<Task[]> {
        return this.taskRepository.find({
            where: { assigned: { id: userId } },
            relations: ['assigned'],
        });
    }

}