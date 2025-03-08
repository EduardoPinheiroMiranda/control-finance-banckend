import { makeAuthenticateUser } from "@/factories/user/make-authenticateUser";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";



export async function authenticateUser(request: FastifyRequest, reply: FastifyReply){

	try{

		const scheme = z.object({
			email: z.string(),
			password: z.string()
		});

		const body = scheme.parse(request.body);


		const serviceAuthenticateUser = makeAuthenticateUser();
		const authorization = await serviceAuthenticateUser.execute(
			body.email,
			body.password
		);

        
		reply.status(200).send(JSON.stringify({
			token: authorization
		}));

	}catch(err: any){

		if(err.name === "Error"){
			reply.status(401).send(JSON.stringify({
				msg: err.message
			}));
		}
        
		reply.status(500).send(JSON.stringify({
			msg: "error internal server!"
		}));
	}
}