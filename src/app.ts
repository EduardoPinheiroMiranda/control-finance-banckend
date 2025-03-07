import Fastify from "fastify";
import { userRoutes } from "./http/routes/user";


export const app = Fastify();


app.register(userRoutes, {prefix: "user"});