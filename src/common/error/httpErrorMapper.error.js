// This maps domain → HTTP.
import { 
    DuplicateRecordError, RecordNotFoundError,
    InvalidCredentialsError, MissingIdentifierError, 
    MissingCredentialError, InvalidTokenError}
from "./domainError.error.js";

import { DomainError } from "./appError.error.js";
import { HttpError } from "./httpError.error.js";

export const mapToHttpError = (error) => {

  if (error instanceof DuplicateRecordError) {
    return new HttpError(error.message, 409);
  }

  if (error instanceof RecordNotFoundError) {
    return new HttpError(error.message, 404);
  }

  if (error instanceof InvalidCredentialsError) {
    return new HttpError(error.message, 401);
  }

  if (error instanceof MissingIdentifierError) {
    return new HttpError(error.message, 400);
  }

  if (error instanceof MissingCredentialError) {
    return new HttpError(error.message, 400);
  }

  if (error instanceof InvalidTokenError) {
    return new HttpError(error.message, 401);
  }

  if (error instanceof DomainError) {
    return new HttpError(error.message, 400);
  }

  return new HttpError("Internal server error", 500);
};