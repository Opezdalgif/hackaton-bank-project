import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../types/JwtPayload.types";

export const JwtPayloadParam = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtPayload => {
    return ctx.switchToHttp().getRequest().user as JwtPayload;
})

