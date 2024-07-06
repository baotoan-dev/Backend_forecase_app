import jwt from "jsonwebtoken";

interface Payload {
    id: string;
    role: number;
}

const signAccessTokenService = async (payload: Payload) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: "1h",
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) throw err;
            resolve(token);
        });
    });
};

export default signAccessTokenService;
