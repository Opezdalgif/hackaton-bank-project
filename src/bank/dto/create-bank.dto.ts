import { IsPhoneNumber, IsString } from "class-validator";

export class CreateBankDto {
    @IsString({message: 'Наименование должно быть строкой'})
    name: string

    @IsString({message: 'Адрес должно быть строкой'})
    address: string

    @IsPhoneNumber('RU')
    phoneNumber: string
    
    @IsString()
    icon: string
}