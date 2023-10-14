import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
    
    @IsNotEmpty({message: 'Имя должно быть заполнено'})
    @IsString({message: 'Имя должно быть строкой'})
    @Length(2, 45 , {message: 'Должно быть от 2 до 45 символов'})
    @IsOptional()
    readonly firstName?: string;

    @IsNotEmpty({message: 'Фамилия должна быть заполнено'})
    @IsString({message: 'Фамилия должно быть строкой'})
    @Length(2, 80 , {message: 'Должно быть от 2 до 80 символов'})
    @IsOptional()
    readonly lastName?: string;

    @IsEmail()
    readonly email: string

    @IsOptional()
    @IsString()
    icon: string

    @IsOptional()
    @IsString()
    phoneNumber: string

    

}