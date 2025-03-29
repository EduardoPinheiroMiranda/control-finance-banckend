import { DataValidationError } from "@/errors/custonErros";


export function hendleErrorsInControlles(err: any){

	if(err.name === "ZodError"){
		return {
			statusCode: 400,
			error: {
				msg: "dados enviados incorreto, verifique a estrutura do objeto ou seus valores",
				err: err.errors
			}
		};
	}
    
	if(err instanceof DataValidationError){

		return {
			statusCode: 400,
			error: {
				msg: err.message,
			}
		};
	}


	console.log(err);
	return {
		statusCode: 500,
		error: {
			msg: "Error internal server"
		}
	};
}