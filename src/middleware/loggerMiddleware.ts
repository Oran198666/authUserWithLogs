import colors from "colors";
import { NextFunction, Request, Response } from "express";

class LoggerMiddleware {
    // Pass-Through Middleware: logs each request (and body, if present)
    // to the console without blocking the request.
    public logToConsole(request: Request, response: Response, next: NextFunction): void {
        const method = request.method;
        const route = request.originalUrl;
        const body = request.body && Object.keys(request.body).length > 0
            ? JSON.stringify(request.body)
            : null;

        let line = `${method} ${route}`;
        if (body) line += ` | Body: ${body}`;

        console.log(colors.rainbow(line));
        next();
    }
}

export const loggerMiddleware = new LoggerMiddleware();