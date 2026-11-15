import dotenv from "dotenv";  ///actual job: .env → process.env
dotenv.config({ quiet: true });  //hides the banner

class AppConfig {
    public readonly port = 4000;
    public readonly mysqlHost = process.env.MYSQL_HOST;
    public readonly mysqlUser = process.env.MYSQL_USER;
    public readonly mysqlPassword = process.env.MYSQL_PASSWORD;
    public readonly mysqlDatabase = process.env.MYSQL_DATABASE;
    public readonly hmacKey = process.env.HMAC_KEY;
    public readonly jwtSecret = process.env.JWT_SECRET;
}

export const appConfig = new AppConfig();
console.log("HMAC:", appConfig.hmacKey, "| JWT:", appConfig.jwtSecret);