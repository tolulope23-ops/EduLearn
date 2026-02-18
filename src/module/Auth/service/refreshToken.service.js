import { InvalidTokenError } from "../../../common/error/domainError.error.js";
import { UserSessionRepository } from "../repository/authSession.repository.js";
import { UserRefreshTokenRepository } from "../repository/refreshToken.repository.js";
import { addDays } from "../utils/passwordHashing.utils.js";
import { generateAccessToken } from "../utils/verificationToken.utils.js";
import { UserSessionService } from "./session.service.js";
import crypto from 'crypto';

export class UserRefreshTokenService{
    /**
     * @param {UserRefreshTokenRepository} refreshTokenRepo
     * @param {UserSessionRepository} sessionRepo
     * @param {UserSessionService} sessionService
     */

    constructor(refreshTokenRepo, sessionRepo, sessionService){
        this.refreshTokenRepo = refreshTokenRepo;
        this.sessionRepo = sessionRepo;
        this.sessionService = sessionService;
    };

    // Create a new refresh token
    async createRefreshToken(sessionId) {
        const { rawToken, hashToken } = await createToken();

        await this.deps.refreshToken.createToken({
            sessionId: sessionId,
            tokenHash: hashToken,
            expiresAt: addDays(7),
        });

        return { rawToken };
    };

    // Verify an incoming refresh token
    async verifyRefreshToken(rawToken) {
        // Hash incoming token
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        //Check token in DB
        const storedToken = await this.refreshTokenRepo.findValidRefreshToken(hashedToken);

        if (!storedToken)
            throw new InvalidTokenError("Invalid Refresh Token");
        

        //Get session
        const session = await this.sessionRepo.getSessionById(storedToken.sessionId);
        if (!session) 
            throw new InvalidTokenError();

        return {
            refreshToken: storedToken,
            userId: session.userId,
            sessionId: session.id,
        };
    };


    // Rotate refresh token
    async rotateRefreshToken(oldToken) {
        const { userId, refreshToken: oldRawToken, sessionId } = await this.verifyRefreshToken(oldToken);

        //Revokes old token
        await this.refreshTokenRepo.revokeToken(oldRawToken.id);

        //Create new refresh token
        const { rawToken } = await this.createRefreshToken(sessionId);

        //Generate new access token
        const accessToken = generateAccessToken(userId, sessionId);

        return {
            refreshToken: rawToken,
            accessToken,
        };
    };
};