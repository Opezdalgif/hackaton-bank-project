import { IsNotEmpty , IsString , IsEmail , Length, IsNumber} from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({message: 'Поле должно быть заполнено'})
    readonly phoneNumber: string;

    @IsNotEmpty({message: 'Email должен быть заполнен'})
    @IsEmail()
    readonly email: string
    
    @IsNotEmpty({message: 'Поле должно быть заполнено'})
    @IsString({message: 'Поле должно быть строкой'})
    @Length(8, 32 , {message: 'Должно быть от 8 до 32 символов'})
    readonly passwordHash: string;


}