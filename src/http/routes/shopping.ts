import { FastifyInstance } from "fastify";
import { checkToken } from "@/middlewares/checkToken";
import { registerShopping } from "../controllers/shopping/registerShopping";
import { listShopping } from "../controllers/shopping/listShopping";
import { updateShopping } from "../controllers/shopping/updateShopping";
import { deleteShopping } from "../controllers/shopping/deleteShopping";



export async function shoppingRoutes(app: FastifyInstance){

	app.route({
		method: "POST",
		url: "/registerShopping",
		preHandler: checkToken,
		handler: registerShopping
	});

	app.route({
		method: "GET",
		url: "/listShopping",
		preHandler: checkToken,
		handler: listShopping
	});

	app.route({
		method: "PUT",
		url: "/updateShopping",
		preHandler: checkToken,
		handler: updateShopping
	});

	app.route({
		method: "DELETE",
		url: "/deleteShopping/:shoppingId",
		preHandler: checkToken,
		handler: deleteShopping
	});
}