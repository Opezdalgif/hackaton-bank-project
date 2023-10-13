import { IsNumber, IsString } from "class-validator";

export class CreateBankWorkloadDto {
    @IsNumber()
    bankId: number

    @IsNumber()
    serviceId: number

}