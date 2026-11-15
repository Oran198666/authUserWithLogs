import { StatusCode } from "./enum";


//error handling
export class ClientError extends Error{
    public readonly status: StatusCode;

    public constructor(status: StatusCode, message: string){
        super(message);
        this.status = status;
    }
}