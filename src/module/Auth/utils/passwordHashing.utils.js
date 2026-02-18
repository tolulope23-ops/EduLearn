import bcrypt from "bcrypt";

export class PasswordHasher {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  };

  async hash(password) {
    return bcrypt.hash(password, this.saltRounds);
  };

  async verify(rawPassword, hashedPassword) {
    return bcrypt.compare(rawPassword, hashedPassword);
  };
};


export function addDays(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

export function addHours(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

export function addMinutes(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
};

export function addSeconds(secs) {
  return new Date(Date.now() + secs * 1000);
};

