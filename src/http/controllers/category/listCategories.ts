import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeListCategories } from "@/factories/category/make-listCategories";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function listCategories(app: FastifyTypes){

	app.get(
		"/listCategories",
		{
			schema: {
				querystring: z.object({
					categoryId: z.string().optional()
				}),
				response: {
					200: z.array(z.object({
						name: z.string(),
						id: z.string(),
						createdAt: z.date(),
						updatedAt: z.date()
					})),
					400: z.object({msg: z.string()})
				},
				tags: ["category"],
				description: "This route is responsible for listing the categories that can be associated with a purchase. It is possible to pass the id of a category to perform pagination, in this situation the id must be that of the last category present in the last search performed."
			},
		},
		async (request, reply) => {

			try{

				const categoryId = request.query.categoryId ? request.query.categoryId : null;


				const serviceListCategories = makeListCategories();
				const categories = await serviceListCategories.execute(categoryId);


				return reply.status(200).send(categories);

			}catch(err: unknown){

				if(err instanceof Error){
					const { error, statusCode } = handleErrorsInControlles(err);
					return reply.status(statusCode).send(error);
				}


				console.log(err);
				return reply.status(500).send({msg: "Error internal server"});	
			}
		}
	);
}