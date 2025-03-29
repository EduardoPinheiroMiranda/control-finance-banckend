import Fastify from "fastify";
import cors from "fastify-cors";
import { userRoutes } from "./http/routes/user";
import { invoiceRoutes } from "./http/routes/invoice";


export const app = Fastify();

app.register(cors);

app.register(userRoutes, {prefix: "user"});
app.register(invoiceRoutes, {prefix: "invoice"});