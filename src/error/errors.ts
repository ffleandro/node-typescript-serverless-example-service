export class RestError extends Error {
  status: number;
  errors?: Array<string>;
    
  constructor(status: number, message: string, errors?: Array<string>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export class BadRequestError extends RestError {
  constructor(errors: string[]) {
    super(400, 'Validation Error', errors);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
  
export class AuthorizationError extends RestError {
  constructor(message?: string) {
    super(401, message || 'Not Authorized');
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
  
export class ForbiddenError extends RestError {
  constructor(message?: string) {
    super(403, message || 'Access Denied');
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends RestError {
  constructor(message?: string) {
    super(404, message || 'Not Found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends RestError {
  constructor(message?: string) {
    super(409, message || 'Conflict');
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
  
export class InternalServerError extends RestError {
  constructor(message?: string) {
    super(500, message || 'Internal Server Error');
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
  

  
