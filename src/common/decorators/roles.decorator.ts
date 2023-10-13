
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AccountRoleEnum } from '../enums/account-role.enum';


export const ROLES_KEY = 'roles';

export const Roles = (...roles: AccountRoleEnum[]) => {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(AccessTokenGuard),
        UseGuards(RolesGuard)
    );
};