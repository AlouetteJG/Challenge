import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskService } from "./task.service";
import { TaskResolver } from "./task.resolver";
import { Task } from "./task.entity";
import { UserModule } from "src/user/user.module";


@Module({
    imports:[
        TypeOrmModule.forFeature([Task]),
        forwardRef(() => UserModule),
    ],
    providers:[TaskService, TaskResolver],
    exports:[TaskService],
})
export class TaskModule {}