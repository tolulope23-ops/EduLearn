import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";

export async function createToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  return { rawToken, hashToken };
};

export async function generateAccessToken(userId, sessionId) {
  return jwt.sign(
    {
      user: userId,
      type: "access",
      sessionId: sessionId,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
};
