import { FastifyInstance } from "fastify";
import { listCategories } from "../controllers/category/listCategories";


export async function categoryRoutes(app: FastifyInstance){

	app.route({
		method: "GET",
		url: "/listCategories/:categoryId",
		handler: listCategories
	});
}