import { makeValueMovements } from "@/factories/application/make-valueMovements";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function valueMovements(request: FastifyRequest, reply: FastifyReply){

	try{

		const body = z.object({
			applicationId: z.string(),
			value: z.number(),
			type: z.enum(["WITHDRAW", "DEPOSIT"]).default("DEPOSIT")
		}).parse(request.body);


		const serviceValueMovements = makeValueMovements();
		const application = await serviceValueMovements.execute(
			body.applicationId,
			body.value,
			body.type
		);


		return reply.status(200).send(JSON.stringify(application));

	}catch(err: any){

		const { error, statusCode } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}