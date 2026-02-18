import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../common/config/env.config.js";

export async function createToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  return { rawToken, hashToken };
};

export async function generateAccessToken(userId, sessionId) {
  return jwt.sign(
    {
      userId,
      sessionId,
      type:"access"
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export function verifyAccessToken(token) {
 const payload = jwt.verify(token, JWT_SECRET);

  if (payload.type !== "access") {
    throw new Error("Invalid token type");
  }
  
  return payload;
};
