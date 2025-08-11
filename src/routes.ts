import { app } from "./app";
import { authenticateUser } from "./http/controllers/user/authenticateUser";
import { controlLimit } from "./http/controllers/user/controlLimit";
import { generalSummary } from "./http/controllers/user/generalSummary";
import { getAllMovements } from "./http/controllers/user/getAllMovements";
import { getUserByToken } from "./http/controllers/user/getUserByToken";
import { registerUser } from "./http/controllers/user/registerUser";
import { updateAvatar } from "./http/controllers/user/updateAvatar";
import { updatePassword } from "./http/controllers/user/updatePassword";
import { updateUser } from "./http/controllers/user/updateUser";


export function registerAllRoutes(){

    // register user routes
    const userPrefix = "user";
    app.register(authenticateUser, {prefix: userPrefix});
    app.register(controlLimit, {prefix: userPrefix});
    app.register(generalSummary, {prefix: userPrefix});
    app.register(getAllMovements, {prefix: userPrefix});
    app.register(getUserByToken, {prefix: userPrefix});
    app.register(registerUser, {prefix: userPrefix});
    app.register(updateAvatar, {prefix: userPrefix});
    app.register(updatePassword, {prefix: userPrefix});
    app.register(updateUser, {prefix: userPrefix});
    

    return;
}