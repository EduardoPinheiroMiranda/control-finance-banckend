export class DataValidationError extends Error{
	constructor(msg: string){
		super(msg);
	}
}