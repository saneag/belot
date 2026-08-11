import { HttpStatus } from "../constants/http-status.js";

export class ApiError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(HttpStatus.NOT_FOUND, message);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, message);
    this.name = "BadRequestError";
  }
}
