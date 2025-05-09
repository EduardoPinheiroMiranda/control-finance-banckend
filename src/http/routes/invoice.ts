import { checkToken } from "@/middlewares/checkToken";
import { FastifyInstance } from "fastify";
import { getCurrentInvoice } from "../controllers/invoice/getCurrentInvoice";


export async function invoiceRoutes(app: FastifyInstance){

	app.route({
		method: "GET",
		url: "/listInvoices/:typeInvoice",
		preHandler: checkToken,
		handler: getCurrentInvoice
	});
}