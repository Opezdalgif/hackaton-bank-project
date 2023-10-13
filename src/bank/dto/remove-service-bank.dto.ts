import { IsNumber } from "class-validator";

export class RemoveServiceBankDto {
    @IsNumber()
    bankId: number

    @IsNumber()
    serviceId: number
}