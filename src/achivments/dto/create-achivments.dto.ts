import { IsString } from "class-validator";

export class CreateAchivmentsDto {
    @IsString()
    name:string

    @IsString()
    get: string

    @IsString()
    icon: string
}