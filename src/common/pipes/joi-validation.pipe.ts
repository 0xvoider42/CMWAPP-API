import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

import { createLogger } from '../logger/logger.config';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  private logger = createLogger('Validation');

  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');

      this.logger.error({ error: errorMessage }, 'Validation failed');
      throw new BadRequestException('Validation failed: ' + errorMessage);
    }
    return value;
  }
}
