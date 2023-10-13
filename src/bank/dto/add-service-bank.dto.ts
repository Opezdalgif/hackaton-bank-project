import { IsNumber } from "class-validator";

export class AddServiceBankDto {
    @IsNumber()
    bankId: number

    @IsNumber()
    serviceId: number
}