import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
    messages;

    constructor(messages) {
        super(messages, HttpStatus.BAD_REQUEST);
        this.messages = messages;
    }
}
