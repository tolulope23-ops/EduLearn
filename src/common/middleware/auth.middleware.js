import { UserSessionRepository } from "../../module/Auth/repository/authSession.repository.js";
import { verifyAccessToken } from "../../module/Auth/utils/verificationToken.utils.js";
import { InvalidTokenError } from "../error/httpError.error.js";

export class UserAuthMiddleware {
    /**
     * @param {UserSessionRepository} sessionRepo
     */

    constructor(sessionRepo){
        this.sessionRepo = sessionRepo;
    };

    authenticate = () => {return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new InvalidTokenError("Missing or invalid token");
            }

            const token = authHeader.split(" ")[1];
            const payload = verifyAccessToken(token);

            const session = await this.sessionRepo.getSessionById(payload.sessionId);

            if (!session || session.revokedAt) {
                return res.status(401).json({ message: "Invalid session" });
            };

            req.user = {
                userId: payload.userId,
                sessionId: payload.sessionId,
            }

            next();
        } catch (error) {
            console.error("AuthMiddleware error:", error);
            return res.status(401).json({
                message: "Invalid or expired token",
            });
        };
    };
    };
};
