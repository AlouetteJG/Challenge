import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from 'src/task/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export type UserRole = 'admin' | 'member';
export type UserStatus = 'active' | 'inactive';

@ObjectType()
@Entity()
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({unique:true})
    email: string;

    @Column()
    password: string;

    @Field()
    @Column({type:'varchar'})
    role: UserRole;

    @Field()
    @Column()
    status: UserStatus;

    @Field(() => [Task], { nullable: true })
    @OneToMany(() => Task, task => task.assigned)
    tasks?: Task[];

}
