import Fastify from "fastify";
import cors from "fastify-cors";
import { userRoutes } from "./http/routes/user";
import { invoiceRoutes } from "./http/routes/invoice";
import { shoppingRoutes } from "./http/routes/shopping";


export const app = Fastify();

app.register(cors);

app.register(userRoutes, {prefix: "user"});
app.register(invoiceRoutes, {prefix: "invoice"});
app.register(shoppingRoutes, {prefix: "shopping"});