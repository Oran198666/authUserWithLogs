import mysql2, { QueryResult } from "mysql2";
import { appConfig } from "./app-config";


class Dal {
    //defines the connection
    private readonly connection = mysql2.createPool({
        host: appConfig.mysqlHost,
        user: appConfig.mysqlUser,
        password:appConfig.mysqlPassword,
        database: appConfig.mysqlDatabase
    })

    //execute uses the connection to run a query now,
    //and returns a Promise that will hold the result when MySQL answers.
    public execute(sql: string, values?: (string | number | null)[]): Promise<QueryResult>{
        return new Promise<QueryResult>((resolve,reject)=>{
            this.connection.query(sql,values,(err,result)=>{
                if(err) reject(err);
                else resolve(result);
            })
        })
    }
}

export const dal = new Dal();
