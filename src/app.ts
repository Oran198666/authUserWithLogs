import express from "express";
import { userController } from "./controllers/userController";
import { loggerMiddleware } from "./middleware/loggerMiddleware";
import { appConfig } from "./utils/app-config";
import { requestLogMiddleware } from "./middleware/requestLogMiddleware";
import { errorMiddleware } from "./middleware/ErrorMiddleware";
import { sabbathMiddleware } from "./middleware/SabbathMiddleware";
import { authController } from "./controllers/authController";
import fileUpload from "express-fileupload";



class App {
    public start(): void {
        const server = express();
        server.use(express.json());
        server.use(fileUpload());
        server.use(loggerMiddleware.logToConsole);
        server.use(requestLogMiddleware.logToDB);
        server.use(sabbathMiddleware.blockOnSaturday);
        server.use(userController.router);
        server.use(authController.router);
        server.use(errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);

        server.listen(appConfig.port, () => console.log("Listening..."));
    }
}

const app = new App();
app.start();
