import { IsEmail, IsNumber, IsOptional, IsString  , Length} from "class-validator";

export class AuthSignInDto{
    @IsOptional()
    @IsString({message: 'Должно быть строкой'})
    readonly phoneNumber?: string;
    
    @IsOptional()
    @IsEmail({},{message: 'Должно быть почтой'})
    readonly email?: string

    @IsString({message: 'Поле должно быть строкой'})
    @Length(4,20,{message: 'Пароль должен быть не меньше 4 и не больше 20 символов'})
    readonly password: string;
}