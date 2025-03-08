import { makeRegisterUser } from "@/factories/user/make-registerUser";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function registerUser(request: FastifyRequest, reply: FastifyReply){

	try{

		const scheme = z.object({
			name: z.string(),
			email: z.string(),
			password: z.string(),
			limit: z.number(),
			expired: z.number()
		});

		const body = scheme.parse(request.body);
		

		const serviceRegisterUser = makeRegisterUser();
		const user = await serviceRegisterUser.execute(body);


		reply.status(201).send(JSON.stringify(user));

	}catch(err: any){

		if(err.name === "Error"){
			reply.status(400).send(JSON.stringify({
				msg: err.message
			}));
		}

		console.log(err);
		reply.status(500).send(JSON.stringify({
			msg: "error internal server!"
		}));
	}
}