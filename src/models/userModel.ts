import z, { email } from "zod";
import { ClientError } from "./clientError";
import { StatusCode } from "./enum";
import { UploadedFile } from "express-fileupload";

const UserSchema = z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email().max(100),
    password: z.string().min(8).max(50)
})

//shape of a user in this app
export class UserModel {
    public id?: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password?: string;
    public roleId?: number;
    public imageName?: string;
    public image?: UploadedFile;

    //used for copying the raw json into a real object with method
    public constructor(user:UserModel){
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.roleId = user.roleId;
        this.imageName = user.imageName;
        this.image = user.image;
    }

    //validate the object against via schema and if it fails return 422
    public validate():void{
        const result = UserSchema.safeParse(this);
        if(!result.success){
            const message = result.error.issues.map( i => `${i.path.join(".")}: ${i.message}`).join(",");
            throw new ClientError(StatusCode.UnprocessableEntity, message);
        }
    }
}