import { IsNumber } from "class-validator";

export class AddAchivmentDto {
    @IsNumber()
    userId: number

    @IsNumber()
    achivmentId: number
}