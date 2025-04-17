import { checkToken } from "@/middlewares/checkToken";
import { FastifyInstance } from "fastify";
import { listInvoices } from "../controllers/invoice/listInvoices";


export async function invoiceRoutes(app: FastifyInstance){

	app.route({
		method: "GET",
		url: "/listInvoices/:typeInvoice",
		preHandler: checkToken,
		handler: listInvoices
	});
}