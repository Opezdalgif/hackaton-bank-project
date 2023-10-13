import { ForbiddenException } from '@nestjs/common';

export class SessionUnavailableException extends ForbiddenException {
    constructor() {
        super('Сессия недействительна');
    }
}
