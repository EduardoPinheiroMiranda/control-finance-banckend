import { checkToken } from "@/middlewares/checkToken";
import { FastifyInstance } from "fastify";
import { getCurrentInvoice } from "../controllers/invoice/getCurrentInvoice";
import { getAllInvoices } from "../controllers/invoice/getAllInvoices";


export async function invoiceRoutes(app: FastifyInstance){

	app.route({
		method: "GET",
		url: "/getCurrentInvoice",
		preHandler: checkToken,
		handler: getCurrentInvoice
	});

	app.route({
		method: "GET",
		url: "/getAllInvoices",
		preHandler: checkToken,
		handler: getAllInvoices
	});
}