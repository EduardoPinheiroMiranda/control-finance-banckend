import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";


export function handleErrorsInControlles(err: any){

	if(err.name === "ZodError"){
		return {
			statusCode: 400,
			error: {
				msg: "dados enviados incorreto, verifique a estrutura do objeto ou seus valores",
				err: err.errors
			}
		};
	}

	if(err instanceof ResourceNotFoud){
		return {
			statusCode: 204,
			error: {
				msg: err.message,
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