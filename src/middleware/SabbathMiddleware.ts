import { NextFunction, Request, Response } from "express";
import { ClientError } from "../models/clientError";
import { StatusCode } from "../models/enum";

class SabbathMiddleware {
    // Short-Circuit Middleware: blocks all requests on Saturday.
    public blockOnSaturday(request: Request, response: Response, next: NextFunction): void {
        const day = new Date().getDay();

        if (day === 6) {
            next(new ClientError(StatusCode.Forbidden, "Shabbat Shalom motherfuckers 🔫- API is closed on Saturday"));
            return;
        }
        next();
    }
}

export const sabbathMiddleware = new SabbathMiddleware();