import { IsPhoneNumber, IsString } from "class-validator"

export class UpdateBankDto {
    @IsString({message: 'Наименование должно быть строкой'})
    name: string

    @IsString({message: 'Адрес должно быть строкой'})
    addres: string

    @IsPhoneNumber('RU')
    phoneNumber: string
    
    @IsString()
    icon: string
}
