import { FastifyInstance } from "fastify";
import { registerUser } from "../controllers/user/registerUser";



export async function userRoutes(app: FastifyInstance){

	app.route({
		method: "post",
		url: "/userRegister",
		handler: registerUser
	});
}