/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response, NextFunction } from 'express';

export const router: Router = Router();

router.get('/health',
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
      payload: { status: 'OK' },
    });
  }
);
