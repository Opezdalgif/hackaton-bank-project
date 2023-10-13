import { BadRequestException } from '@nestjs/common';

export class FileIncorrectFormatException extends BadRequestException {
    constructor() {
        super('Файл имеет неподдерживаемый формат');
    }
}
