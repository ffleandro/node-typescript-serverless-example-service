import { NextFunction, Request, Response } from 'express';
import CognitoExpress from 'cognito-express';
import { AuthorizationError, ForbiddenError } from '../error/errors';

export class CognitoMiddleware {
  cognitoExpress: CognitoExpress;

  init = (region: string, poolId: string) => {
    this.cognitoExpress = new CognitoExpress({
      region: region,
      cognitoUserPoolId: poolId,
      tokenUse: 'access', //Possible Values: access | id
      tokenExpiration: 60 * 60 * 1000 //Up to default expiration of 1 hour (3600000 ms)
    });
  };

  readBearerToken = (req: Request) => {
    let token = (req.headers['x-access-token'] || req.headers['authorization'] || '').toString();
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    
    return token;
  };

  parseJwt = (token: string) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  };

  validateScopes = (token: string, allowed_scopes: string[]) => {
    if (!allowed_scopes || allowed_scopes.length == 0) {
      return true;
    }

    const jwt = this.parseJwt(token);
    const scopes = jwt.scope.split(' ');

    return allowed_scopes.some(scope=> scopes.includes(scope));
  };
    
  middleware = (region: string, poolId: string) => {
    this.init(region, poolId);

    return async (req: Request, res: Response, next: NextFunction) => {
      const token = this.readBearerToken(req);
            
      if (token && token !== '') {
        req.token = token;
      }

      next();
    };
  };

  protect = (scope?: string | string[]) => {
    let scopes: string[];
    if (scope && typeof scope === 'string') {
      scopes = [scope];
    } else if (scope && Array.isArray(scope)) {
      scopes = scope;
    }

    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.token || req.token === '') {
        throw new AuthorizationError();
      }
            
      try {
        const user = await this.cognitoExpress.validate(req.token);
        req.user = user;
      } catch (err) {
        throw new ForbiddenError();
      }

      if (!this.validateScopes(req.token, scopes)) {
        throw new ForbiddenError();
      }

      next();
    };
  };
}

export const cognito =  new CognitoMiddleware();
