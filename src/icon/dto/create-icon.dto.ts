import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class CreateIconDto {
    @IsString()
    readonly icon: string

    @IsBoolean()
    readonly IsUser: boolean

    @IsNumber()
    bank_id?: number | null
}