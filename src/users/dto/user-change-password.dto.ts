import { IsNotEmpty, IsString, Length } from "class-validator"

export class UserChangePasswordDto {
    @IsNotEmpty({message: 'Поле должно быть заполнено'})
    @IsString({message: 'Должно быть строкой'})
    @Length(8,32,{message: 'Длина должна быть от 8 до 32'})
    readonly oldPassword: string

    @IsNotEmpty({message: 'Поле должно быть заполнено'})
    @IsString({message: 'Должно быть строкой'})
    @Length(8,32,{message: 'Длина должна быть от 8 до 32'})
    readonly password: string

}