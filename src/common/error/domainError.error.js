export class DuplicateRecordError extends Error {
  constructor(message = "Duplicate record") {
    super(message);
    this.name = "DuplicateRecordError";
  }
}

export class MissingIdentifierError extends Error {
  constructor(message = "Email must be provided") {
    super(message);
    this.name = "MissingIdentifierError";
  }
}

export class MissingCredentialError extends Error {
  constructor(message = "Password must be provided") {
    super(message);
    this.name = "MissingCredentialError";
  }
}

export class InvalidTokenError extends Error {
  constructor(message = "Invalid verification token") {
    super(message);
    this.name = "InvalidTokenError";
  }
}

export class InvalidSessionError extends Error {
  constructor(message = "Invalid session") {
    super(message);
    this.name = "InvalidSessionError";
  }
}

export class TokenExpiredError extends Error {
  constructor(message = "Verification token expired") {
    super(message);
    this.name = "TokenExpiredError";
  }
}

export class RecordNotFoundError extends Error {
  constructor(message = "Record not found") {
    super(message);
    this.name = "RecordNotFoundError";
  }
}

export class InvalidReferenceError extends Error {
  constructor(message = "Invalid reference") {
    super(message);
    this.name = "InvalidReferenceError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message = "Invalid credential") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class DatabaseError extends Error {
  constructor(message = "Database operation failed") {
    super(message);
    this.name = "DatabaseError";
  }
}

export class DatabaseConnectionError extends Error {
  constructor(message = "Database connection failed") {
    super(message);
    this.name = "DatabaseConnectionError";
  }
};
