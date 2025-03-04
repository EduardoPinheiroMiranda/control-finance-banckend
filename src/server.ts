import { app } from ".";


app.listen({ port: 3300 })
	.then(() => {
		console.log("server runnign!!");
	})
	.catch((err) => {
		console.log("Erro internal server!!", err);
	});