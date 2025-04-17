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
		dueDate,
		dueDate - 1,
		invoices.length,
		false
	);
	const dueDates = listOfDates.map((dates) => dates.dueDate);


	const installmentValue = (purchaseValue/totalInstalments).toFixed(2);
	const totalInstallmentsToCreate = invoices.length;
	const listInstallmentsToCrerate: Installment[] = [];


	for(let i = 0; i < totalInstallmentsToCreate; i++){
		listInstallmentsToCrerate.push({
			installment_number: i+1,
			installment_value: Decimal(installmentValue),
			due_date: dueDates[i],
			shopping_id: shoppingId,
			invoice_id: invoices[i].id,
		});
	}


	const installments = await installmentRepository.create(listInstallmentsToCrerate);


	return {
		installments,
		listInstallmentsToCrerate
	};
}