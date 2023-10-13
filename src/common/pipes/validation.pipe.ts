import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';


export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const obj = plainToClass(metadata.metatype, value);
        const errors = await validate(obj);

        if (errors.length > 0) {
            const messages = errors.map((err) => {
                return {
                    property: err.property,
                    messages: Object.values(err.constraints),
                };
            });
            throw new ValidationException(messages);
        }

        return value;
    }
}
