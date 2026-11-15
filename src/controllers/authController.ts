import express, { Request, Response, NextFunction, Router } from "express";
import { userService } from "../service/userService";
import { StatusCode } from "../models/enum";

class AuthController {
    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/register", this.register);
        this.router.post("/api/login", this.login);
    }

    private async register(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const token = await userService.registerUser(request.body);
            response.status(StatusCode.Created).json(token);
        }
        catch (err: any) {
            next(err);
        }
    }

    // Log in an existing user:
    private async login(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const token = await userService.login(request.body);
            response.status(StatusCode.OK).json(token);
        }
        catch (err: any) {
            next(err);
        }
    }
}

export const authController = new AuthController();