import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { UpdateTaskInput } from './dto/update-task.input';
import { CreateTaskInput } from './dto/create-task.input';
import { User, UserRole } from 'src/user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTask(createTaskInput: CreateTaskInput): Promise<Task> {
    const user = await this.userRepository.findOneBy({
      id: createTaskInput.assignedId,
    });
    if (!user) throw new NotFoundException('Assigned user not found');

    const task = this.taskRepository.create({
      title: createTaskInput.title,
      description: createTaskInput.description,
      status: createTaskInput.status,
      assigned: user,
    });
    return this.taskRepository.save(task);
  }

  async updateTask(
    updateTaskInput: UpdateTaskInput,
    userPayload: { sub: string; role: UserRole },
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: updateTaskInput.id },
      relations: ['assigned'],
    });
    if (!task) {
      throw new NotFoundException(
        `Task with ID ${updateTaskInput.id} not found`,
      );
    }

    if (userPayload.role === 'admin') {
      if (updateTaskInput.title !== undefined) {
        task.title = updateTaskInput.title;
      }
      if (updateTaskInput.description !== undefined) {
        task.description = updateTaskInput.description;
      }
      if (updateTaskInput.status !== undefined) {
        task.status = updateTaskInput.status;
      }

      if (userPayload.role === 'admin' && updateTaskInput.assignedId) {
        const assignedUser = await this.userRepository.findOne({
          where: { id: updateTaskInput.assignedId },
        });
        if (!assignedUser) {
          throw new NotFoundException(
            `User with ID ${updateTaskInput.assignedId} not found`,
          );
        }
        task.assigned = assignedUser;
      }
      return this.taskRepository.save(task);
    }
    console.log(userPayload.sub);
    if (userPayload.sub === task.assigned.id) {
      if (updateTaskInput.status !== undefined) {
        task.status = updateTaskInput.status;
      }
      if (
        updateTaskInput.title ||
        updateTaskInput.description ||
        updateTaskInput.assignedId
      ) {
        throw new ForbiddenException('Permission denied to update this task.');
      }
      return this.taskRepository.save(task);
    }

    throw new ForbiddenException('Permission denied to update this task.');
  }

  async removeTask(id: string): Promise<boolean> {
    const result = await this.taskRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return true;
  }

  async findOneTask(
    id: string,
    userPayload: { sub: string; role: UserRole },
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assigned'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    if (
      userPayload.role !== UserRole.admin &&
      task.assigned?.id !== userPayload.sub
    ) {
      throw new ForbiddenException('Access denied!');
    }
    return task;
  }

  async findAllTasks(userPayload: {
    sub: string;
    role: UserRole;
  }): Promise<Task[]> {
    if (userPayload.role === 'admin') {
      return this.taskRepository.find();
    }
    if (userPayload.role === 'member') {
      return this.taskRepository.find({
        where: { assigned: { id: userPayload.sub } },
      });
    }
    throw new Error('User role not recognized.');
  }

  async findByAssignedId(userId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { assigned: { id: userId } },
      relations: ['assigned'],
    });
  }
}
