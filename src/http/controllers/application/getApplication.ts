import { makeGetApplication } from "@/factories/application/make-getApplication";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function getApplication(request: FastifyRequest, reply: FastifyReply){

	try{

		const params = z.object({
			applicationId: z.string()
		}).parse(request.params);


		const serviceGetApplication = makeGetApplication();
		const application = await serviceGetApplication.execute(params.applicationId);


		return reply.status(200).send(JSON.stringify(application));

	}catch(err: any){

		const { error, statusCode } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}