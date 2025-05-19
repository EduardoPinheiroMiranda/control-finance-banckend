import { makeUpdateApplication } from "@/factories/application/make-updateApplication";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function updateApplication(request: FastifyRequest, reply: FastifyReply){

	try{

		const body = z.object({
			id: z.string(),
			name: z.string(),
			targetValue: z.number(),
			institution: z.string().nullable(),
			colorFont: z.string().nullable(),
			colorApplication: z.string().nullable(),
			icon: z.string()
		}).parse(request.body);


		const serviceUpdateApplication = makeUpdateApplication();
		const application = await serviceUpdateApplication.execute(
			body.id,
			{
				name: body.name,
				targetValue: body.targetValue,
				institution: body.institution,
				colorFont: body.colorFont,
				colorApplication: body.colorApplication,
				icon: body.icon
			}
		);


		return reply.status(200).send(JSON.stringify(application));

	}catch(err: any){

		const { error, statusCode } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}