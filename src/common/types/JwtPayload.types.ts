import { AccountRoleEnum } from "../enums/account-role.enum";

export type JwtPayload = {
    role?: AccountRoleEnum,
    userId?: number;
    email?: string;
    sessionId: number;
  };