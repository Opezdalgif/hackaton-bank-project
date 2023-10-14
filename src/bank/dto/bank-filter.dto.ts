import { IsEnum, IsOptional, IsString } from "class-validator";
import { WorkloadValue } from "src/common/enums/workload.enum";

export class BankFilerDto {
    @IsString()
    serviceIds: string

    @IsOptional()
    @IsEnum(WorkloadValue)
    workloadValue?: WorkloadValue
}