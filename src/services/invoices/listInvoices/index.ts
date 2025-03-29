import { DataValidationError } from "@/errors/custonErros";
import { InvoiceDatabaseinterface } from "@/repositories/interfaces/invoice";


export class ListInvoices{

	constructor(
        private invoiceRepository: InvoiceDatabaseinterface
	){}


	async execute(userId: string, typeInvoice: string){

		const invoices = await this.invoiceRepository.filterInvoices(
			userId,
			typeInvoice
		);
        
		if(!invoices){
			throw new DataValidationError("Não foi encontrado movimentações.");
		}

		return invoices; 
	}
}