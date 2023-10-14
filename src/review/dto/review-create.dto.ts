import { IsNotEmpty } from "class-validator";

export class CreateReviewDto {

    @IsNotEmpty({message: 'Не может быть пустым'})
    readonly bankId: number

    @IsNotEmpty({message: 'Поле должно быть заполнено'})
    readonly text: string

    @IsNotEmpty({message: 'Поле должно быть заполнено'})
    readonly mark: string
}