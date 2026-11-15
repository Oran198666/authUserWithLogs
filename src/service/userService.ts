import { Role } from "../models/enum";
import { CredentialsModel } from "../models/credentialsModel";
import { UserModel } from "../models/userModel";
import { dal } from "../utils/dal";
import { OkPacket, OkPacketParams } from "mysql2";
import { StatusCode } from "../models/enum";
import { ClientError } from "../models/clientError";
import { cyber } from "../utils/cyber";
import { fileSaver } from "../utils/fileSaver";

class UserService {
    public async getAllUsers(): Promise<any[]> {
        const sql = "Select id,firstName,lastName,email,roleId FROM users";
        return await dal.execute(sql) as any[];
    }

    public async getOneUser(id: number): Promise<any> {
        const sql = "Select id,firstName,lastName,email,roleId FROM users WHERE id=?";
        const users = await dal.execute(sql, [id]) as any[];
        return users[0];
    }

    public async registerUser(user: UserModel): Promise<any> {
        const model = new UserModel(user);
        model.validate();
        model.email = model.email.trim().toLowerCase();
        model.password = cyber.hashPassword(model.password!);
        model.roleId = Role.User;
        if (model.image) {
            model.imageName = await fileSaver.add(model.image);
            delete model.image;
        }

        const sql = "INSERT INTO users (firstName, lastName, email, password, roleId, imageName) VALUES (?, ?, ?, ?, ?, ?)";

        try {
            const info = await dal.execute(sql, [model.firstName, model.lastName, model.email, model.password!, model.roleId, model.imageName ?? null]) as OkPacket;
            model.id = info.insertId;
        }
        catch (err: any) {
            if (err.code === "ER_DUP_ENTRY") {
                throw new ClientError(StatusCode.Conflict, "Email already registered");
            }
            throw err;
        }

        const token = cyber.getNewToken(model);
        return token;
    }

    public async login(credentials: CredentialsModel): Promise<string> {
        const model = new CredentialsModel(credentials);
        model.validate();
        model.email = model.email.trim().toLowerCase();
        const hashedPassword = cyber.hashPassword(model.password);
        const sql = "SELECT id, firstName, lastName, email, roleId FROM users WHERE email = ? AND password = ?";
        const users = await dal.execute(sql, [model.email, hashedPassword]) as UserModel[];
        const user = users[0];
        if (!user) throw new ClientError(StatusCode.Unauthorized, "Incorrect email or password");
        return cyber.getNewToken(user);
    }

    public async updateUser(id: number, user: UserModel): Promise<any> {
        const model = new UserModel(user);
        model.validate();
        model.id = id;
        model.email = model.email.trim().toLowerCase();
        model.password = cyber.hashPassword(model.password);
        const oldImageName = await this.getImageName(id);
        if (model.image) {
            model.imageName = await fileSaver.update(model.image, oldImageName);
            delete model.image;
        } else {
            model.imageName = oldImageName;
        }


        const sql = "UPDATE users SET firstName = ?, lastName = ?, email = ?, password = ?, imageName = ? WHERE id = ?";
        const info = await dal.execute(sql, [model.firstName, model.lastName, model.email, model.password, model.imageName ?? null, id]) as OkPacket;
        if (info.affectedRows === 0) {
            throw new ClientError(StatusCode.NotFound, `user ${id} not found`);
        }
        delete model.password;
        return model;
    }
    public async deleteUser(id: number): Promise<void> {
        const imageName = await this.getImageName(id);
        const sql = "DELETE FROM users WHERE id = ?"
        const info = await dal.execute(sql, [id]) as OkPacket;
        if (info.affectedRows === 0) {
            throw new ClientError(StatusCode.NotFound, `user ${id} not found`);
        }
        if (imageName) await fileSaver.delete(imageName);
    }

    private async getImageName(id: number): Promise<string> {
        const sql = "SELECT imageName FROM users WHERE id=?";
        const rows = await dal.execute(sql, [id]) as any[];
        return rows[0]?.imageName;
    }
}

export const userService = new UserService();