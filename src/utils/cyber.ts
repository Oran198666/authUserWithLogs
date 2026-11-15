import { Role } from "../models/enum";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { appConfig } from "./app-config";
import { UserModel } from "../models/userModel";

class Cyber {
    public hashPassword(plainText: string): string {
        return crypto.createHmac("sha512", appConfig.hmacKey!).update(plainText).digest("hex");
    }
    public getNewToken(user: UserModel): string {
        const { password, ...userWithoutPassword } = user;
        return jwt.sign({ user: userWithoutPassword }, appConfig.jwtSecret!, { expiresIn: "3h" });
    }
    public verifyToken(token: string): boolean {
        try {
            if (!token) {
                return false;
            }
            jwt.verify(token, appConfig.jwtSecret!);
            return true;
        } catch (err: any) {
            return false;
        }
    }

    public verifyAdmin(token: string): boolean {
        try {
            if (!token) {
                return false;
            }
            jwt.verify(token, appConfig.jwtSecret!);
            const payload = jwt.decode(token) as { user: UserModel };
            const user = payload.user;
            if (user.roleId !== Role.Admin) {
                return false;
            }
            return true;
        } catch (err: any) {
            return false;
        }
    }
}

export const cyber = new Cyber();
