/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response, NextFunction } from 'express';
import { cognito } from '../../middleware/cognito';
import { validate } from '../../middleware/validator';

import {
  createAcronym,
  getAcronym,
  updateAcronym,
  deleteAcronym,
  listAcronym
} from '../../service/acronym';

import {
  CreateAcronymSchema,
  UpdateAcronymSchema,
  ListAcronymSchema,
} from './request';

export const router: Router = Router();

router.get('/acronym',
  validate(ListAcronymSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await listAcronym(req.query);
    res.status(200).send({
      payload: result,
    });
  }
);

router.post('/acronym',
  validate(CreateAcronymSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await createAcronym(req.body);
    res.status(201).send({
      payload: result,
    });
  }
);

router.get('/acronym/:acronym',
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAcronym(req.params.acronym);
    res.status(200).send({
      payload: result,
    });
  }
);

router.put('/acronym/:acronym',
  cognito.protect('example-service/update-acronym'),
  validate(UpdateAcronymSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateAcronym(req.params.acronym, req.body);
    res.status(200).send({
      payload: result,
    });
  }
);

router.delete('/acronym/:acronym',
  cognito.protect('example-service/delete-acronym'),
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteAcronym(req.params.acronym);
    res.status(204).send();
  }
);
