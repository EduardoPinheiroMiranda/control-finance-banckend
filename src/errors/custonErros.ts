export class DataValidationError extends Error{
	constructor(msg: string){
		super(msg);
	}
}

export class ResourceNotFoud extends Error{
	constructor(msg: string){
		super(msg);
	}
}