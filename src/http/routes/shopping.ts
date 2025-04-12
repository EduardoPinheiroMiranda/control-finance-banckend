import { FastifyInstance } from "fastify";
import { checkToken } from "@/middlewares/checkToken";
import { registerShopping } from "../controllers/shopping/registerShopping";



export async function shoppingRoutes(app: FastifyInstance){

	app.route({
		method: "post",
		url: "/registerShopping",
		preHandler: checkToken,
		handler: registerShopping
	});
}