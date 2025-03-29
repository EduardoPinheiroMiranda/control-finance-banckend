import { checkToken } from "@/middlewares/checkToken";
import { FastifyInstance } from "fastify";
import { registerInvoice } from "../controllers/invoice/registerInvoice";
import { listInvoices } from "../controllers/invoice/listInvoices";


export async function invoiceRoutes(app: FastifyInstance){

	app.route({
		method: "POST",
		url: "/registerInvoice",
		preHandler: checkToken,
		handler: registerInvoice
	});

	app.route({
		method: "GET",
		url: "/listInvoices/:typeInvoice",
		preHandler: checkToken,
		handler: listInvoices
	});
}