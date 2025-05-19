import Fastify from "fastify";
import cors from "fastify-cors";
import { userRoutes } from "./http/routes/user";
import { invoiceRoutes } from "./http/routes/invoice";
import { shoppingRoutes } from "./http/routes/shopping";
import { startCronJobs } from "./cron-jobs";
import { categoryRoutes } from "./http/routes/category";
import { cardRoutes } from "./http/routes/card";
import { applicationRoutes } from "./http/routes/application";


export const app = Fastify();

app.register(cors);


// register routes 
app.register(userRoutes, {prefix: "user"});
app.register(invoiceRoutes, {prefix: "invoice"});
app.register(shoppingRoutes, {prefix: "shopping"});
app.register(categoryRoutes, {prefix: "category"});
app.register(cardRoutes, {prefix: "card"});
app.register(applicationRoutes, {prefix: "application"});


startCronJobs();