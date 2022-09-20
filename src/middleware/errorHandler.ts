import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  return res
    .status(err.status || 500)
    .json({
      message: err.message || 'Internal Server Error',
      errors: err.errors,
    });
};

export default errorHandler;
