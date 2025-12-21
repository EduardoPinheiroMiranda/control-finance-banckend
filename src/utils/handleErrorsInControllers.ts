import { DataValidationError, ResourceNotFound } from "@/errors/custonErros";


export function handleErrorsInControlles(err: Error){

	if(err instanceof ResourceNotFound){
		return {
			statusCode: 400,
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