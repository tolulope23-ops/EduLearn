import rateLimit from "express-rate-limit";

export const createRateLimiter = ({ maxRequests, windowMs, message, keyGenerator }) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: { status: "error", message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyGenerator || ((req) => req.ip),
  });
};