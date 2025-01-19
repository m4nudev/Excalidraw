import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "./config";
import jwt, { JwtPayload } from "jsonwebtoken";


interface JwtPayloadWithUserId extends JwtPayload {
    userId: string;
}


export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUserId;

    if (decoded) {
        req.userId = decoded.userId;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}