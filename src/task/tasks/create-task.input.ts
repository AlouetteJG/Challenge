import { Field, InputType, Int } from "@nestjs/graphql";
import { TaskStatus } from "../task.entity";

@InputType()
export class CreateTaskInput {
    @Field()
    title:string;

    @Field()
    description:string;

    @Field(()=>Int)
    assignedId:number;

    @Field(() => TaskStatus)
    status: TaskStatus;
}