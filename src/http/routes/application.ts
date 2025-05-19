import { checkToken } from "@/middlewares/checkToken";
import { FastifyInstance } from "fastify";
import { registerApplication } from "../controllers/application/registerApplication";
import { updateApplication } from "../controllers/application/updateApplication";
import { valueMovements } from "../controllers/application/valueMovements";
import { getApplication } from "../controllers/application/getApplication";
import { getAllApplications } from "../controllers/application/getAllApplications";
import { filterApplications } from "../controllers/application/filterApplications";
import { deleteApplication } from "../controllers/application/deleteApplication";


export async function applicationRoutes(app: FastifyInstance){

	app.route({
		method: "DELETE",
		url: "/deleteApplication/:applicationId",
		preHandler: checkToken,
		handler: deleteApplication
	});

	app.route({
		method: "POST",
		url: "/filterApplications",
		preHandler: checkToken,
		handler: filterApplications
	});

	app.route({
		method: "GET",
		url: "/getAllApplications",
		preHandler: checkToken,
		handler: getAllApplications
	});

	app.route({
		method: "GET",
		url: "/getApplication/:applicationId",
		preHandler: checkToken,
		handler: getApplication
	});

	app.route({
		method: "POST",
		url: "/registerApplication",
		preHandler: checkToken,
		handler: registerApplication
	});

	app.route({
		method: "PUT",
		url: "/updateApplication",
		preHandler: checkToken,
		handler: updateApplication
	});

	app.route({
		method: "POST",
		url: "/valueMovements",
		preHandler: checkToken,
		handler: valueMovements
	});
}