import { IsEnum, IsString } from "class-validator";

export class CreateServicesDto {
    @IsString()
    name: string
}