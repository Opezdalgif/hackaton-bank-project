import { InternalServerErrorException } from '@nestjs/common';

export class FileErrorUploadException extends InternalServerErrorException {
    constructor() {
        super('Ошибка записи файла');
    }
}
