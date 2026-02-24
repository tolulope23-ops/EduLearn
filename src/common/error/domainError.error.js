import { DomainError } from "./appError.error.js";

export class DuplicateRecordError extends DomainError {
  constructor(message = "Duplicate record") {
    super(message);
  }
};

export class RecordNotFoundError extends DomainError {
  constructor(message = "Record not found") {
    super(message);
  }
};

export class InvalidCredentialsError extends DomainError {
  constructor(message = "Invalid credentials") {
    super(message);
  }
};


export class MissingIdentifierError extends DomainError {
  constructor(message = "Email must be provided") {
    super(message);
  }
};


export class MissingCredentialError extends DomainError {
  constructor(message = "Password must be provided") {
    super(message);
  }
};


export class InvalidTokenError extends DomainError {
  constructor(message = "Invalid verification token") {
    super(message);
  }
}
