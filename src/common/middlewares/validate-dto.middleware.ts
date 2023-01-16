import { IMiddleware } from './middleware.interface.js';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import ValidationError from '../errors/validation-error.js';
import { transformErrors } from '../../utils/common-functions.js';

export class ValidateDtoMiddleware implements IMiddleware {
  constructor(private readonly dto: ClassConstructor<object>) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const {body, path} = req;
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: ${path}`, transformErrors(errors));
    }

    next();
  }
}
