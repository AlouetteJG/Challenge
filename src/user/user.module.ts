import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => TaskModule),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService, TypeOrmModule],   // Por si se requiere usar en otro modulo
})
export class UserModule {}
