import { DomainError } from "./appError.error.js";

export class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
};

export class BadRequestError extends DomainError {
  constructor(message = "Bad request") {
    super(message);
    this.statusCode = 400; // optional, can be used in your error handler
  }
};