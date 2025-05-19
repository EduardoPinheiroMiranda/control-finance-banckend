import { checkToken } from "@/middlewares/checkToken";
import { FastifyInstance } from "fastify";
import { getCurrentInvoice } from "../controllers/invoice/getCurrentInvoice";
import { getAllInvoices } from "../controllers/invoice/getAllInvoices";
import { getAllCardInvoices } from "../controllers/invoice/getAllCardInvoices";
import { payInvoice } from "../controllers/invoice/payInvoice";


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

	app.route({
		method: "GET",
		url: "/getAllCardInvoices/:cardId",
		preHandler: checkToken,
		handler: getAllCardInvoices
	});

	app.route({
		method: "PUT",
		url: "/payInvoice",
		preHandler: checkToken,
		handler: payInvoice
	});
}