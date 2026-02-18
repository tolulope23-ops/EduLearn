import {
  DuplicateRecordError,
  RecordNotFoundError,
  InvalidReferenceError,
  DatabaseError,
  DatabaseConnectionError,
} from "./domainError.error.js"

import {
  UniqueConstraintError,
  ForeignKeyConstraintError,
  EmptyResultError,
  ConnectionError
} from "sequelize";

const handleSequelizeError = (error) => {
  if (error instanceof UniqueConstraintError) {
    throw new DuplicateRecordError();
  };

  if (error instanceof ForeignKeyConstraintError) {
    throw new InvalidReferenceError();
  };

  if (error instanceof EmptyResultError) {
    throw new RecordNotFoundError();
  };

  if (error instanceof ConnectionError) {
    throw new DatabaseConnectionError();
  };

  if (error instanceof DatabaseError) {
    throw new DatabaseError();
  };

  throw error;
};

export default handleSequelizeError;