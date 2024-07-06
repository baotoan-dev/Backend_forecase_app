import jwt from "jsonwebtoken";
import redisClient from "../../configs/redis";

interface Payload {
    id: string;
    role: number;
}

const signRefreshTokenService = async (payload: Payload) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: "30d",
        };
        jwt.sign(payload, secret, options, async (err, token) => {
            if (err) {
                reject(err);
            }

            const currentToken = await redisClient.get(payload.id);

            let newToken = token;

            if (currentToken) {
                let arrToken = currentToken.split(",");
                // Limit 3 token for each user
                if (arrToken.length >= 3) {
                    arrToken.shift();
                }

                newToken = arrToken.join(",") + "," + token;
            }

            // SET REFRESH TOKEN TO REDIS
            redisClient.set(
                payload.id,
                newToken,
                {
                    EX: 60 * 60 * 24 * 30,
                },
            );
            resolve(token);
        });
    });
};

export default signRefreshTokenService;
