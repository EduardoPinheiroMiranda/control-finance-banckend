import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";


export class ListInvoices{

	constructor(
        private invoiceRepository: InvoiceDatabaseInterface
	){}


	async execute(userId: string){
		console.log("ainda voi fazer :)");
	}
}