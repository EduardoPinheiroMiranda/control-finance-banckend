import { FastifyInstance } from "fastify";
import { checkToken } from "@/middlewares/checkToken";
import { registerShopping } from "../controllers/shopping/registerShopping";
import { listShopping } from "../controllers/shopping/listShopping";



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
}