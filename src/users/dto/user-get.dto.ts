import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class UserGetDto {
    @IsOptional()
    @IsNumber({}, {message: 'Должно быть числом'})
    readonly id?: number;

    @IsOptional()
    @IsString({message: 'Некорректный номер телефона'})
    readonly phoneNumber?: string;

    @IsOptional()
    @IsEmail({},{message: 'Некорректный email'})
    readonly email? : string;

}