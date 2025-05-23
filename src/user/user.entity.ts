import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Task } from 'src/task/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  admin = 'admin',
  member = 'member',
}

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Field()
  @Column({ type: 'boolean' })
  isActive: boolean;

  @Field(() => [Task], { nullable: true })
  @OneToMany(() => Task, (task) => task.assigned)
  tasks?: Task[];
}
