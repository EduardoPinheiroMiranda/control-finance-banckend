import { makeGetAllApplications } from "@/factories/application/make-getAllApplications";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function getAllApplications(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);


		const serviceGetAllApplications = makeGetAllApplications();
		const applications = await serviceGetAllApplications.execute(userId);


		return reply.status(200).send(JSON.stringify(applications));

	}catch(err: any){

		const { error, statusCode } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}