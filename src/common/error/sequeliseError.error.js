import {
  UniqueConstraintError,
  ForeignKeyConstraintError,
  EmptyResultError,
  ConnectionError,
  DatabaseError as SequelizeDatabaseError,
} from "sequelize";

import { DuplicateRecordError, RecordNotFoundError } from "./domainError.error.js";
import { DomainError } from "./appError.error.js";

export const handleSequelizeError = (error) => {

  if (error instanceof UniqueConstraintError) {
    throw new DuplicateRecordError("Duplicate value detected");
  }

  if (error instanceof ForeignKeyConstraintError) {
    throw new DomainError("Invalid reference provided");
  }

  if (error instanceof EmptyResultError) {
    throw new RecordNotFoundError();
  }

  if (error instanceof ConnectionError) {
    throw new DomainError("Database connection failed");
  }

  if (error instanceof SequelizeDatabaseError) {
    throw new DomainError("Database operation failed");
  }

  throw error;
};