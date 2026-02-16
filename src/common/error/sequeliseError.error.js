import {
  DuplicateRecordError,
  RecordNotFoundError,
  InvalidReferenceError,
  DatabaseError,
  DatabaseConnectionError,
} from "./domainError.error"

import {
  UniqueConstraintError,
  ForeignKeyConstraintError,
  EmptyResultError,
  DatabaseError,
  ConnectionError
} from "sequelize";

export default handleSequelizeError = (error) => {
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

  if (error instanceof SequelizeDatabaseError) {
    throw new DatabaseError();
  };

  throw error;
}