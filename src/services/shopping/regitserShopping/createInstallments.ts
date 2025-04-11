import { Installment } from "@/@types/customTypes";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { Invoice } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


export async function createInstallments(
	shoppingId: string,
	purchaseValue: number,
	totalInstalments: number,
	dueDate: number,
	invoices: Invoice[],
	installmentRepository: InstallmentDatabaseInterface
){

	const handlerDueDate = new HandlerDueDate();
	const listOfDates = handlerDueDate.generateDueDates(
		dueDate, dueDate - 1, totalInstalments, false
	);
	const dueDates = listOfDates.map((dates) => dates.dueDate);


	const createInstallments: Installment[] = [];

	for(let i=0; i<totalInstalments; i++){
		createInstallments.push({
			installment_number: i+1,
			total_installments: totalInstalments,
			installment_value: Decimal(purchaseValue/totalInstalments),
			due_date: dueDates[i],
			shopping_id: shoppingId,
			invoice_id: invoices[i].id,
		});
	}


	const installments = await installmentRepository.create(createInstallments);


	return {
		installments,
		createInstallments
	};
}