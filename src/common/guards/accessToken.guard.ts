import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtPayload } from "../types/JwtPayload.types";
import { UsersService } from "src/users/services/users.service";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AccessTokenGuard extends AuthGuard('access-token') {
    constructor(
        @Inject(AuthService)
        private readonly authService: AuthService
    ){
        super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        
        const jwtPayload: JwtPayload = context
            .switchToHttp()
            .getRequest().user;
        
        //console.log(`СессияId: ${jwtPayload.sessionId}`)
        const session = await this.authService.get(
            jwtPayload.sessionId
        )
        
        context.switchToHttp().getRequest().user = {
            userId: session.user.id,
            phoneNumber: session.user.phoneNumber,
            sessionId: jwtPayload.sessionId,
            role: session.user.role,

        };

        return true;
    }
}