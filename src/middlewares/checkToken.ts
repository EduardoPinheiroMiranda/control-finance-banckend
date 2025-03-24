import { env } from "@/env";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";


interface Decoded extends JwtPayload{
    userId: string
};


export function checkToken(
	request: FastifyRequest,
	reply: FastifyReply,
	done: HookHandlerDoneFunction
){

	const authToken = request.headers["authorization"];

	if(!authToken){
		return reply.status(401).send(JSON.stringify({
			msg: "Acesso negado."
		}));
	}


	const [, token] = authToken.split(" ");


	try{

		jwt.verify(token, env.SECRET);

		const decoded = jwt.decode(token) as Decoded;

		if (decoded.exp && Date.now() >= (decoded.exp * 1000) ) {
			return reply.status(401).send(JSON.stringify({
				msg: "Acesso negado."
			}));
		}


		request.headers["user-id"] = decoded.userId;
        

		done();

		// eslint-disable-next-line
	}catch(err: any){

		return reply.status(401).send(JSON.stringify({
			msg: "Acesso negado."
		}));
	}
}
