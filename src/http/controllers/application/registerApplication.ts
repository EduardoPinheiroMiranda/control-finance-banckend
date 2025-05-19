import { makeRegisterApplication } from "@/factories/application/make-registerApplication";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function registerApplication(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);
		const body = z.object({
			name: z.string(),
			targetValue: z.number(),
			institution: z.string().nullable(),
			colorFont: z.string().nullable(),
			colorApplication: z.string().nullable(),
			icon: z.string()
		}).parse(request.body);


		const serviceRegisterApplication = makeRegisterApplication();
		const application = await serviceRegisterApplication.execute(userId, body);


		return reply.status(201).send(JSON.stringify(application));

	}catch(err: any){

		const { error, statusCode } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}