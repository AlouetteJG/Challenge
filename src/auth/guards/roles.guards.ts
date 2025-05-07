import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector:Reflector){}

    canActivate(context: ExecutionContext): boolean{
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ]);
        if(!requiredRoles) return true;
        
        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;
        if(!user){
            throw new ForbiddenException('User not authenticated');
        }
        const hasRole =  requiredRoles.includes(user.role);
        if(!hasRole){
            throw new ForbiddenException('Access denied!');
        }

        return true;
        
    }
}
