import { TaskService } from './task.service';
import { Task } from './task.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/guards/roles.decorator';
import { UserRole } from 'src/user/user.entity';
import { CurrentUser } from 'src/auth/guards/current-user.decorator';
import { UserPayload } from 'src/auth/guards/jwt-payload';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => [Task])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.member)
  @Query(() => [Task])
  findAllTasks(@CurrentUser() user: UserPayload) {
    return this.taskService.findAllTasks(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.member)
  @Query(() => Task)
  findTaskById(@Args('id') id: string, @CurrentUser() user: UserPayload) {
    return this.taskService.findOneTask(id, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Mutation(() => Task)
  createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskInput);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.member)
  @Mutation(() => Task)
  updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
    @CurrentUser() user: UserPayload,
  ): Promise<Task> {
    return this.taskService.updateTask(updateTaskInput, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Mutation(() => Boolean)
  removeTask(@Args('id', { type: () => String }) id: string) {
    return this.taskService.removeTask(id);
  }
}
