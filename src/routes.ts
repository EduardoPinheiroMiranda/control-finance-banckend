import { app } from "./app";
import { getAllCardInvoices } from "./http/controllers/invoice/getAllCardInvoices";
import { getAllInvoices } from "./http/controllers/invoice/getAllInvoices";
import { getCurrentInvoice } from "./http/controllers/invoice/getCurrentInvoice";
import { payInvoice } from "./http/controllers/invoice/payInvoice";
import { deleteShopping } from "./http/controllers/shopping/deleteShopping";
import { listShopping } from "./http/controllers/shopping/listShopping";
import { registerShopping } from "./http/controllers/shopping/registerShopping";
import { updateShopping } from "./http/controllers/shopping/updateShopping";
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
    
    // register shoppings routes
    const shoppingPrefix = "shopping";
    app.register(registerShopping, {prefix: shoppingPrefix});  
    app.register(listShopping, {prefix: shoppingPrefix});
    app.register(updateShopping, {prefix: shoppingPrefix});
    app.register(deleteShopping, {prefix: shoppingPrefix});
    
    // register invoices routes
    const invoicePrefix = "invoice";
    app.register(getAllCardInvoices, {prefix: invoicePrefix});
    app.register(getAllInvoices, {prefix: invoicePrefix});
    app.register(getCurrentInvoice, {prefix: invoicePrefix});
    app.register(payInvoice, {prefix: invoicePrefix});

    return;
}