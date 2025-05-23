import { Field, ID, InputType } from '@nestjs/graphql';
import { TaskStatus } from '../task.entity';

@InputType()
export class CreateTaskInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID)
  assignedId: string;

  @Field(() => TaskStatus)
  status: TaskStatus;
}
