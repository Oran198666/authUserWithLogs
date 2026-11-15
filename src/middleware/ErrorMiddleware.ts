import { NextFunction, Request, Response } from "express";
import { ClientError } from "../models/clientError";
import { StatusCode } from "../models/enum";
import Colors from "colors";

class ErrorMiddleware {
    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        const err = new ClientError(StatusCode.NotFound, `Route ${request.originalUrl} on method ${request.method} not found`);
        next(err);
    }
    public catchAll(err: any, request: Request, response: Response, next: NextFunction): void {
        const status = err.status || StatusCode.InternalServerError;
        const line = `${status} | ${err.message}`;
        console.log(status >= StatusCode.InternalServerError ? Colors.red(line) : Colors.yellow(line));
        const message = err.message;
        response.status(status).json({message});
    }
}
export const errorMiddleware = new ErrorMiddleware();