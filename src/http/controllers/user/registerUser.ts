import { makeRegisterUser } from "@/factories/user/make-registerUser";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function registerUser(request: FastifyRequest, reply: FastifyReply){

	try{

		const scheme = z.object({
			name: z.string(),
			email: z.string(),
			password: z.string()
		});

		const body = scheme.parse(request.body);
		

		const serviceRegisterUser = makeRegisterUser();
		await serviceRegisterUser.execute({
			name: body.name,
			email: body.email,
			password: body.password,
			limit: 1000,
			expired: 10
		});


		return reply.status(201).send(JSON.stringify({
			msg: "Usuário cadastrado com sucesso."
		}));

	}catch(err: any){

		if(err.name === "Error"){

			return reply.status(400).send(JSON.stringify({
				msg: err.message
			}));

		}else{
			
			console.log(err);

			return reply.status(500).send(JSON.stringify({
				msg: "error internal server!"
			}));
		}		
	}
}