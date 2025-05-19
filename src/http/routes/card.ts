import { checkToken } from "@/middlewares/checkToken";
import { FastifyInstance } from "fastify";
import { registerCard } from "../controllers/card/registerCard";
import { updateCard } from "../controllers/card/updateCard";
import { listCard } from "../controllers/card/listCard";
import { disableCard } from "../controllers/card/disableCard";


export async function cardRoutes(app: FastifyInstance){

	app.route({
		method: "PUT",
		url: "/disableCard/:cardId",
		preHandler: checkToken,
		handler: disableCard
	});
    
	app.route({
		method: "GET",
		url: "/listCard",
		preHandler: checkToken,
		handler: listCard
	});

	app.route({
		method: "POST",
		url: "/registerCard",
		preHandler: checkToken,
		handler: registerCard
	});

	app.route({
		method: "PUT",
		url: "/updateCard",
		preHandler: checkToken,
		handler: updateCard
	});
}