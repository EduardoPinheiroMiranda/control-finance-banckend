import Fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { userRoutes } from "./http/routes/user";


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
        // components: {
		// 	securitySchemes: {
		// 		bearerAuth: {
		// 			type: "http",
		// 			scheme: "bearer",
		// 			bearerFormat: "JWT",
		// 		},
		// 	},
		// },
		// security: [
		// 	{
		// 		bearerAuth: [],
		// 	},
		// ],
    },
	transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, {routePrefix: "/docs"})



// register routes 
app.register(userRoutes, {prefix: "user"});



app.setErrorHandler((err, _, reply) => {

    // console.log(err.validation[0].params);
    
    if(Array.isArray(err.validation)){
        reply.status(err.statusCode ?? 400).send(JSON.stringify({
            msg: "Data validation error.",
            error: err.validation.map((issue) => issue.params)
        }));
    }
});