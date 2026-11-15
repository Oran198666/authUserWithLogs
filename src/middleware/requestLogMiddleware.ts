import { NextFunction, Request, Response } from "express";
import { requestLogService } from "../service/requestLogService";

class RequestLogMiddleware {
    public logToDB(request: Request, response: Response, next: NextFunction): void {
        const body = request.body && Object.keys(request.body).length > 0
            ? JSON.stringify(request.body)
            : null;
        requestLogService
            .logRequest(request.method, request.originalUrl, body)
            .catch(err => console.error("Log failed:", err.message));
        next();
    }
}

export const requestLogMiddleware = new RequestLogMiddleware();