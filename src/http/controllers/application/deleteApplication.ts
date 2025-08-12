import { makeDeleteApplication } from "@/factories/application/make-deleteApplication";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function deleteApplication(request: FastifyRequest, reply: FastifyReply){

	try{

		const params = z.object({
			applicationId: z.string()
		}).parse(request.params);


		const serviceDeleteApplication = makeDeleteApplication();
		const applications = await serviceDeleteApplication.execute(params.applicationId);


		return reply.status(200).send(JSON.stringify(applications));

	}catch(err: any){

		const { error, statusCode } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}