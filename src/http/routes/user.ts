import { FastifyInstance } from "fastify";
import { registerUser } from "../controllers/user/registerUser";
import { authenticateUser } from "../controllers/user/authenticateUser";
import { generalSummary } from "../controllers/user/generalSummary";



export async function userRoutes(app: FastifyInstance){

	app.route({
		method: "post",
		url: "/userRegister",
		handler: registerUser
	});

	app.route({
		method: "POST",
		url: "/authenticate",
		handler: authenticateUser
	});

	app.route({
		method: "GET",
		url: "/generalSummary/:user_id",
		handler: generalSummary
	});

}