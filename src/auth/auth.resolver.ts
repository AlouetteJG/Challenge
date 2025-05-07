import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
    constructor(
        private authService:AuthService
    ){}

    @Mutation(() => String)
    async login(@Args('loginInput') loginInput: LoginInput):Promise<string>{
        const result = await this.authService.login(loginInput.email, loginInput.password);
        return result.access_token;
    }
}
