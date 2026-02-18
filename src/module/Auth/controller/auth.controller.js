import { BadRequestError } from "../../../common/error/httpError.error.js";
import { UserAuthService } from "../service/auth.service.js";

export class UserAuthController{
    /**
     * @param {UserAuthService} userAuthService 
     */

    constructor(userAuthService){
        this.userAuthService = userAuthService;
    }

    signUp = async(req, res, next) => {
        try {
            const register = await this.userAuthService.signUp(req.body);
            return res.status(201).json({
                success: true,
                message: "User successfully registered",
                user: register
            });
        } catch (error) {
            next(error);
        };
    };

    login = async (req, res, next) => {
        try {
            const ipAddress = req.ip;
            const userAgent = req.headers["user-agent"];

            const signin = await this.userAuthService.login({...req.body, ipAddress, userAgent});

            res.cookie("refreshToken", signin.refreshToken, {
                httpOnly: true,
                secure: false,        
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                message: "User successfully logged in",
                accessToken: signin.accessToken
            });
        } catch (error) {
            next(error)
        };
    };

    verifyEmail = async (req, res, next) => {
        try {
            const { token } = req.query;

            // Validate token presence
            if (!token || typeof token !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Verification token is missing or invalid",
                });
            };
            await this.userAuthService.verifyService.verifyEmailVerificationTokens(token);
            return res.status(200).json({
                success: true,
                message: "Email verified successfully",
            });
        } catch (error) {
            next(error);
        };
    };

    forgotPassword = async (req, res, next) => {
        try {
            const { email } = req.body;

            // Call service to handle forgot password (send reset email)
            const forgot = await this.userAuthService.forgotPassword(email);
            if(!forgot)
                throw new BadRequestError('Unable to send forgot password email');

            return res.status(200).json({
                success: true,
                message: "Password reset instructions have been sent to your email",
            });
        } catch (error) {
            next(error);
        };
    };

    resetPassword = async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;

            // Call service to verify token, reset password
            await this.userAuthService.resetPassword(token,  newPassword);

            return res.status(200).json({
                success: true,
                message: "Password has been successfully reset. Please login again.",
            });

        } catch (error) {
            next(error);
        };
    };

    logout = async(req, res, next) => {
        try {
            const { userId, sessionId } = req.user; 

            if (!userId || !sessionId) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid session or user not authenticated",
                });
            };

            await this.userAuthService.logout(userId, sessionId);
        } catch (error) {
            next(error);
        };
    };
}