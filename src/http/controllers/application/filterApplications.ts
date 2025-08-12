import { makeFilterApplications } from "@/factories/application/make-filterApplications";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function filterApplications(request: FastifyRequest, reply: FastifyReply){

	try{

		const body = z.object({
			date: z.string().nullable(),
			applicationId: z.string().nullable(),
			type: z.string().nullable()
		}).parse(request.body);


		const serviceFilterApplications = makeFilterApplications();
		const applications = await serviceFilterApplications.execute(body);


		return reply.status(200).send(JSON.stringify(applications));

	}catch(err: any){

		const { error, statusCode } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}