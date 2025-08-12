import { makeListCategories } from "@/factories/category/make-listCategories";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function listCategories(request: FastifyRequest, reply: FastifyReply){

	try{

		const params = z.object({
			categoryId: z.string().nullable()
		}).parse(request.params);


		const serviceListCategories = makeListCategories();
		const categories = await serviceListCategories.execute(params.categoryId);


		return reply.status(200).send(JSON.stringify(categories));

	}catch(err: any){

		const { error, statusCode } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}