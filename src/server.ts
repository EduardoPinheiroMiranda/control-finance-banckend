import { app } from "./app";
import { env } from "./env";


app.listen({ port: env.PORT })
	.then(() => {
		console.log("server runnign!!");
	})
	.catch((err) => {
		console.log("Erro internal server!!", err);
	});