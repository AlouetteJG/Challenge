import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TaskStatus{
    TODO = "TO_DO",
    INPROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}

registerEnumType (TaskStatus,{
    name:'TaskStatus',
})

@ObjectType()
@Entity()
export class Task{
    @Field()
    @PrimaryGeneratedColumn()
    id:number;

    @Field()
    @Column()
    title:string;

    @Field()
    @Column()
    description:string;

    @Field(() => User)
    @ManyToOne(() => User, user => user.tasks, { eager: true })
    assigned: User;

    @Field(() => TaskStatus)
    @Column({
    type: 'enum',
    enum: TaskStatus,
    })
    status: TaskStatus;
}