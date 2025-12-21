import Fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { registerAllRoutes } from "./routes";


export const app = Fastify().withTypeProvider<ZodTypeProvider>();


app.register(fastifyCors, { origin: "*"});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Control Finance",
			version: "1.0.0"
		},
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT"
				}
			}
		}
	},
	transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, {routePrefix: "/docs"});



// register all routes 
registerAllRoutes();



app.setErrorHandler((err, _, reply) => {

	if(Array.isArray(err.validation)){
		return reply.status(err.statusCode ?? 400).send({
			msg: "Data validation error.",
			error: err.validation.map((issue) => issue.params)
		});
	}

	console.log(err);
});