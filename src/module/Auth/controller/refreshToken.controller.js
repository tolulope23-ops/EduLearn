import {UserRefreshTokenService} from '../service/refreshToken.service.js'

export class RefreshTokenController{
    /**
     * @param {UserRefreshTokenService} refreshTokenService
     */

    constructor(refreshTokenService){
        this.refreshTokenService = refreshTokenService
    };

    refreshToken = async  (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            const token = await this.refreshTokenService.rotateRefreshToken(refreshToken);

            // Set new refresh token in secure HTTP-only cookie
            res.cookie("refreshToken", token.refreshToken, {
                httpOnly: true,
                secure: false,        
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                accessToken: token.accessToken
            });
        } catch (error) {
            next(error);
        };
    };
}