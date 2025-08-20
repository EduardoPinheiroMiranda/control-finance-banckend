import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeDeleteApplication } from "@/factories/application/make-deleteApplication";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function deleteApplication(app: FastifyTypes){

	app.delete(
		"/deleteApplication/:applicationId",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				params: z.object({
					applicationId: z.string()
				}),
				response: {
					200: z.object({msg: z.string().describe("Aplicação excluida.")}),
					400: z.object({msg: z.string()})
				},
				tags: ["application"],
				description: "This route is responsible for deleting an application that the user has."
			},
			preHandler: checkToken
		},
		async (requets, reply) => {

			try{

				const serviceDeleteApplication = makeDeleteApplication();
				await serviceDeleteApplication.execute(
					requets.params.applicationId
				);


				return reply.status(200).send({msg: "Aplicação excluida."});

			}catch(err){

				const { error, statusCode } = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}