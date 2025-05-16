import { FastifyInstance } from "fastify";
import { registerUser } from "../controllers/user/registerUser";
import { authenticateUser } from "../controllers/user/authenticateUser";
import { generalSummary } from "../controllers/user/generalSummary";
import { getUserByToken } from "../controllers/user/getUserByToken";
import { checkToken } from "@/middlewares/checkToken";
import { controlLimit } from "../controllers/user/controlLimit";
import { getAllMovements } from "../controllers/user/getAllMovements";
import { updatePassword } from "../controllers/user/updatePassword";



export async function userRoutes(app: FastifyInstance){

	app.route({
		method: "POST",
		url: "/authenticate",
		handler: authenticateUser
	});

	app.route({
		method: "POST",
		url: "/controlLimit",
		preHandler: checkToken,
		handler: controlLimit
	});

	app.route({
		method: "GET",
		url: "/generalSummary",
		preHandler: checkToken,
		handler: generalSummary
	});

	app.route({
		method: "POST",
		url: "/getAllMovements",
		preHandler: checkToken,
		handler: getAllMovements
	});

	app.route({
		method: "GET",
		url: "/getUserByToken",
		preHandler: checkToken,
		handler: getUserByToken
	});
	
	app.route({
		method: "post",
		url: "/userRegister",
		handler: registerUser
	});

	app.route({
		method: "POST",
		url: "/updatePassword",
		preHandler: checkToken,
		handler: updatePassword
	});
}