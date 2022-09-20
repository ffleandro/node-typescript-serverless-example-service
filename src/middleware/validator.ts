import Joi from 'joi';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BadRequestError } from '../error/errors';
 
export const validate = (schema: Joi.ObjectSchema, location: 'body' | 'query' = 'body'): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[location], { abortEarly: false });
    if (error) {
      next(new BadRequestError(error.details.map(e => e.message)));
    } else {
      req[location] = value;
      next();
    }
  };
};
