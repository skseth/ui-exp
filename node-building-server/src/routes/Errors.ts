import * as Koa from 'koa';
import bodyParser from 'koa-bodyparser';

abstract class ApiError {
  message: string;
  constructor(message: string) {
    this.message = message;
  }

  isApiError: boolean = true;

  abstract httpStatus(): number;
}

export class ApiValidationError extends ApiError {
  constructor(message: string) {
    super(message);
  }

  httpStatus = () => 400;
}

export class ApiBusinessError extends ApiError {
  constructor(message: string) {
    super(message);
  }

  httpStatus = () => 422;
}

export class ApiSystemError extends ApiError {
  constructor(message: string) {
    super(message);
  }

  httpStatus = () => 500;
}

function isApiError(err: ApiError | Object): err is ApiError {
  return (err as ApiError).isApiError !== undefined;
}

export function ApiErrorHandler() {
  return async (ctx: Koa.Context, next: Function) => {
    try {
      await next();
    } catch (e) {
      console.log(JSON.stringify(e, undefined, 2));
      if (isApiError(e)) {
        ctx.status = e.httpStatus();
        ctx.body = {
          message: e.message
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          message: e.message
        };
      }
    }
  };
}
