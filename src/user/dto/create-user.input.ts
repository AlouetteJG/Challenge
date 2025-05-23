import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from '../user.entity';
import { IsEmail, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({}, { message: 'El email no tiene un formato válido.' })
  email: string;

  @Field()
  @Length(8, 20, {
    message: 'La contraseña debe tener entre 8 y 20 caracteres.',
  })
  password: string;

  @Field()
  role: UserRole;

  @Field()
  isActive: boolean;
}
