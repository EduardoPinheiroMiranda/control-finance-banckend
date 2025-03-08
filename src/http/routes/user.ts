import { FastifyInstance } from "fastify";
import { registerUser } from "../controllers/user/registerUser";
import { authenticateUser } from "../controllers/user/authenticateUser";



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
}