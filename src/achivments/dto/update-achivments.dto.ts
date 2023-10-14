import { IsOptional, IsString } from "class-validator"

export class UpdateAchievementDto {
    
    @IsString()
    name:string

    @IsString()
    get: string

    @IsString()
    icon: string
}