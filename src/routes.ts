import { app } from "./app";
import { deleteApplication } from "./http/controllers/application/deleteApplication";
import { filterApplications } from "./http/controllers/application/filterApplications";
import { getAllApplications } from "./http/controllers/application/getAllApplications";
import { getApplication } from "./http/controllers/application/getApplication";
import { registerApplication } from "./http/controllers/application/registerApplication";
import { updateApplication } from "./http/controllers/application/updateApplication";
import { valueMovements } from "./http/controllers/application/valueMovements";
import { disableCard } from "./http/controllers/card/disableCard";
import { listCard } from "./http/controllers/card/listCard";
import { registerCard } from "./http/controllers/card/registerCard";
import { updateCard } from "./http/controllers/card/updateCard";
import { listCategories } from "./http/controllers/category/listCategories";
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
import { getUserByToken } from "./http/controllers/user/getUserByToken";
import { registerUser } from "./http/controllers/user/registerUser";
import { updateAvatar } from "./http/controllers/user/updateAvatar";
import { updatePassword } from "./http/controllers/user/updatePassword";
import { updateUser } from "./http/controllers/user/updateUser";
import { getAllMovements } from "./http/controllers/movement/getAllMovements";


export function registerAllRoutes(){

	// register user routes
	const userPrefix = "user";
	app.register(authenticateUser, {prefix: userPrefix});
	app.register(controlLimit, {prefix: userPrefix});
	app.register(generalSummary, {prefix: userPrefix});
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


	// register categories routes
	const categoryPrefix = "category";
	app.register(listCategories, {prefix: categoryPrefix});


	// register cards routes
	const cardPrefix = "card";
	app.register(registerCard, {prefix: cardPrefix});
	app.register(listCard, {prefix: cardPrefix});
	app.register(disableCard, {prefix: cardPrefix});
	app.register(updateCard, {prefix: cardPrefix});
    

	// register application routes
	const applicationPrefix = "application";
	app.register(registerApplication, {prefix: applicationPrefix});
	app.register(deleteApplication, {prefix: applicationPrefix});
	app.register(filterApplications, {prefix: applicationPrefix});
	app.register(getAllApplications, {prefix: applicationPrefix});
	app.register(getApplication, {prefix: applicationPrefix});
	app.register(updateApplication, {prefix: applicationPrefix});
	app.register(valueMovements, {prefix: applicationPrefix});

	// register movements routes
	const movementPrefix = "movement";
	app.register(getAllMovements, {prefix: movementPrefix});

	
	return;
}