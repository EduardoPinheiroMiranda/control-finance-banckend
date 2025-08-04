import Fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";


export const app = Fastify().withTypeProvider<ZodTypeProvider>();


app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*"});

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Control Finance",
            version: "1.0.0"
        }
    },
	transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, {
    routePrefix: "/docs"
})


// register routes 
