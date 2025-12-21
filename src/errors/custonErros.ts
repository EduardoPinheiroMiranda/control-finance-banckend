export class DataValidationError extends Error{
	constructor(msg: string){
		super(msg);

		if(Error.captureStackTrace) {
			Error.captureStackTrace(this, DataValidationError);
		}
	}
}


export class ResourceNotFound extends Error{
	constructor(msg: string){
		super(msg);
		
		if(Error.captureStackTrace) {
			Error.captureStackTrace(this, ResourceNotFound);
		}
	}

	
}