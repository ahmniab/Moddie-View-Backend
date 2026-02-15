import jwt from 'jsonwebtoken';
import EnvVars from '@src/common/constants/env';

const secretKey = EnvVars.JwtSecret;

export const createRoomJwt = (roomId: string): string => {
    if (!secretKey) {
        throw new Error("JWT secret key is not defined");
    }
    const payload: jwt.JwtPayload = {
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + EnvVars.RoomExpirationTime,
        iss: "moddie-view-backend",
    }
    return jwt.sign(payload, secretKey);
}

export const verifyRoomJwt = (token: string): jwt.JwtPayload => {
    if (!secretKey) {
        throw new Error("JWT secret key is not defined");
    }
    try {
        const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
        if (decoded.iss !== "moddie-view-backend") {
            throw new Error("Invalid JWT token issuer");
        } else if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            throw new Error("JWT token has expired");
        }
        return decoded;
    } catch (err) {
        throw new Error("Invalid JWT token");
    }
}

