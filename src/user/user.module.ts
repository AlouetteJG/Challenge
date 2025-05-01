import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Conecta User con TypeORM
  providers: [UserService, UserResolver], //Service y Solver añadidos
  exports: [UserService],   // Por si se requiere usar en otro modulo
})
export class UserModule {}
