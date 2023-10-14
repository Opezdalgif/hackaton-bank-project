import { IsString } from "class-validator";

export class BankFilerDto {
    @IsString()
    serviceIds: string
}