import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../models/enum";
import { cyber } from "../utils/cyber";
import { ClientError } from "../models/clientError";

class SecurityMiddleware {
    public whiteList(request: Request, response: Response, next: NextFunction): void {
        const allowedIps = ["::1", "127.0.0.1", "::ffff:127.0.0.1"];
        const userIp = request.ip?.toString()!;
        if (!allowedIps.includes(userIp)) {
            next(new ClientError(StatusCode.Forbidden, "Access denied from your IP"));
            return;
        }
        next();
    }

    public verifyLoggedIn(request: Request, response: Response, next: NextFunction): void {
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7);
        if (cyber.verifyToken(token!)) {
            next();
        } else {
            const err = new ClientError(StatusCode.Unauthorized, "you're not authorized");
            next(err);
        }
    }

    public verifyAdmin(request: Request, response: Response, next: NextFunction): void {

        //extract Token
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7);
        // if legal token & admin
        if (cyber.verifyAdmin(token!)) {
            next();
        } else {
            const err = new ClientError(StatusCode.Forbidden, "you're not authorized");
            next(err);
        }
    }
}

export const securityMiddleware = new SecurityMiddleware();