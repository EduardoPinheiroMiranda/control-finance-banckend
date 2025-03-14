import Fastify from "fastify";
import cors from "fastify-cors";
import { userRoutes } from "./http/routes/user";


export const app = Fastify();

app.register(cors);
app.register(userRoutes, {prefix: "user"});