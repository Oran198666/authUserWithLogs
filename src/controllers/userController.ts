import fs from "fs";
import { StatusCode } from "../models/enum";
import express, { Request, Response, NextFunction, Router } from "express";
import { userService } from "../service/userService";
import { UserModel } from "../models/userModel";
import { ClientError } from "../models/clientError";
import { securityMiddleware } from "../middleware/securityMiddleware";
import { fileSaver } from "../utils/fileSaver";

class UserController {
    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/users/images/:imageName", this.getUserImage);
        this.router.get("/api/users", this.getAllUsers);
        this.router.get("/api/users/:id", this.getOneUser);
        this.router.post("/api/users", securityMiddleware.verifyLoggedIn, this.registerUser);
        this.router.put("/api/users/:id", securityMiddleware.verifyLoggedIn, this.updateUser);
        this.router.delete("/api/users/:id", securityMiddleware.verifyAdmin, this.deleteUser);
    }

    public async getOneUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = +request.params.id;
            const user = await userService.getOneUser(id);
            if (!user) throw new ClientError(StatusCode.NotFound, `User: ${id} not found `);
            response.json(user);
        } catch (err: any) {
            next(err);
        }
    }
    public async getAllUsers(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            response.json(users);
        } catch (err: any) {
            next(err);
        }
    }

    public async registerUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            request.body.image = request.files?.image;
            const newUser = await userService.registerUser(request.body);
            response.status(StatusCode.Created).json(newUser);
        } catch (err: any) {
            next(err);
        }
    }

    public async updateUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = +request.params.id;
            request.body.image = request.files?.image;
            const user = await userService.updateUser(id, request.body);
            response.json(user);
        } catch (err: any) {
            next(err);
        }
    }

    public async deleteUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = +request.params.id;
            await userService.deleteUser(id);
            response.sendStatus(StatusCode.NoContent);
        } catch (err: any) {
            next(err);
        }
    }

private async getUserImage(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
        const imageName = request.params.imageName as string;
        const imagePath = fileSaver.getImagePath(imageName);
        if (!fs.existsSync(imagePath)) {
            throw new ClientError(StatusCode.NotFound, "Image not found");
        }
        response.sendFile(imagePath);
    } catch (err: any) {
        next(err);
    }
}
}

export const userController = new UserController();