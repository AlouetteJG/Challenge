import { Field, InputType } from "@nestjs/graphql";
import { UserStatus } from "../user.entity";

@InputType()
export class CreateUserInput {
    @Field()
    email:string;

    @Field()
    password:string;

    @Field()
    role: 'admin' | 'member';

    @Field()
    status: UserStatus;

}