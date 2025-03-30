// import { Invoice } from "@/@types/customTypes";
// import { DataValidationError } from "@/errors/custonErros";
// import { InvoiceDatabaseinterface } from "@/repositories/interfaces/invoice";


// export class UpdateInvoice{

// 	constructor(
//         private invoiceRepository: InvoiceDatabaseinterface
// 	){}


// 	async execute(invoiceID: string, data: Invoice){
        
// 		const invoiceToupdate = await this.invoiceRepository.findInvoiceById(invoiceID);

// 		if(!invoiceToupdate){
// 			throw new DataValidationError("Erro ao encontrar os dados desejados.");
// 		}


// 		// name: string,
// 		// typeInvoice: string,
// 		// paymentMethod: string,
// 		// value: number,
// 		// expired: string,
// 		// description: string,
// 		// numberOfInstallments: number,


// 		// if(data.value <= 0){
// 		// 	throw new DataValidationError("Valor da fatura invalido.");
// 		// }
        
        
// 		// const currrentDate = new Date().getDate().toString();
        
// 		// if(
// 		// 	data.typeInvoice === typeInvoices[1] && 
// 		//             data.expired <= currrentDate
// 		// ){
// 		// 	throw new DataValidationError("Data de vencimento deve ser superior ao dia atual.");
// 		// }
        
        
// 		// if(
// 		// 	data.paymentMethod === paymentMethods[1] && 
// 		//             data.numberOfInstallments <= 0
// 		// ){
// 		// 	throw new DataValidationError("Quantidade de parcelas invalidas");
// 		// }
        
// 	}
// }