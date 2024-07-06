import jwt from "jsonwebtoken";
import redisClient from "../../configs/redis";
import * as accountServices from "../account/_service.account";

interface Payload {
    id: string;
    role: number;
}

const verifyRefreshTokenService = async (refreshToken: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async function (err, payload: Payload) {
                if (err) {
                    // Token expired
                    if (err.name === "TokenExpiredError") {
                        reject("Token expired");
                        return;
                        // Invalid token
                    } else if (err.name === "JsonWebTokenError") {
                        reject("Invalid token");
                        return;
                    } else {
                        reject("Verify refresh token failure");
                        return;
                    }
                }

                // Get payload
                const { id } = payload;

                const accountData = await accountServices.readAccountByIdService(
                    id,
                );

                if (!accountData) {
                    reject("Account not found");
                    return;
                }

                if (accountData.status === 0) {
                    reject("Account is blocked");
                    return;
                }

                // Get refresh token by email in redis
                try {
                    const reply = await redisClient.get(id);
                    if (reply === null) {
                        reject('Invalid refresh token');
                    } else {
                        let arrayRefreshToken = reply.split(",");
                        let index = arrayRefreshToken.indexOf(refreshToken);
                        if (index > -1) {
                            resolve(payload);
                        } else {
                            resolve(1);
                        }
                    }
                } catch (error) {
                    reject("Get refresh token by email error");
                }
            }
        );
    })
}

export default verifyRefreshTokenService;
