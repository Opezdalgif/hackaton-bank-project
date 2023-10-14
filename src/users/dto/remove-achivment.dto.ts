import { IsNumber } from "class-validator"

export class RemoveAchivmentDto {
    @IsNumber()
    userId: number

    @IsNumber()
    achivmentId: number
}