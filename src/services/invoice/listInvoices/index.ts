import { ResourceNotFoud } from "@/errors/custonErros";
import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";


export class ListInvoices{

	constructor(
        private invoiceRepository: InvoiceDatabaseInterface
	){}


	async execute(userId: string, typeInvoice: string){

		const invoices = await this.invoiceRepository.filterInvoices(
			userId,
			typeInvoice
		);
        
		if(!invoices){
			throw new ResourceNotFoud("Não foi encontrado movimentações.");
		}

		return invoices; 
	}
}