import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayloadParam } from '../decorators/jwt-payload.decorator';
import { JwtPayload } from '../types/JwtPayload.types';
import { AccountRoleEnum } from '../enums/account-role.enum';



@Injectable()
export class RolesGuard implements CanActivate{

	constructor(
		private reflector: Reflector
	) {}

	canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<AccountRoleEnum[]>(
            ROLES_KEY,
            context.getHandler(),
        );

        const jwtPayload: JwtPayload = context
            .switchToHttp()
            .getRequest().user;
		
			console.log(roles)

        if (roles) {
            if (!roles.includes(jwtPayload.role)) {
                throw new ForbiddenException(`Доступ запрещен`);
            }
        }

        return true;
    }
}
