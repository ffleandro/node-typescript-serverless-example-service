import express, { Express } from 'express';
import domainMiddleware from 'express-domain-middleware';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import { cognito } from '../middleware/cognito';
import { loadRouters } from '../utils/loadRouters';
import errorHandler from '../middleware/errorHandler';
import { NotFoundError } from '../error/errors';

import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http');


const createApp = () => {
  const app: Express = express();

  /************************************************************************************
   *                              Basic Express Middlewares
   ***********************************************************************************/

  app.set('json spaces', 2);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(domainMiddleware);

  // Handle logs and cors during development
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    app.use(cors());
  }

  // Handle security and origin in production
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }

  // Handle cognito authorization
  const awsRegion = process.env.COGNITO_REGION || '';
  const cognitoUserPoolId = process.env.COGNITO_POOL_ID || '';
  app.use(cognito.middleware(awsRegion, cognitoUserPoolId));

  /************************************************************************************
   *                               Register all routes
   ***********************************************************************************/
  const basepath = process.env.API_BASEPATH
    ? `${process.env.API_BASEPATH}`.replace(/\/$/, '')
    : ''; // Default base path

  loadRouters(__dirname + '/../api')
    .forEach(router => {
      app.use(basepath, router);
    });

  // Fallback route
  app.use('*', () => {
    throw new NotFoundError();
  });

  /************************************************************************************
   *                               Express Error Handling
   ***********************************************************************************/


  app.use(errorHandler);

  return app;
};

export default createApp;
