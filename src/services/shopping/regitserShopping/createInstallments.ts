import { Installment } from "src/@types/customTypes";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { Invoice } from "@/generated/prisma/client";
import { Decimal } from "@/generated/prisma/runtime/library";


export async function createInstallments(
	shoppingId: string,
	purchaseValue: number,
	totalInstalments: number,
	dueDay: number,
	invoices: Invoice[],
	installmentRepository: InstallmentDatabaseInterface
){

	const handlerDueDate = new HandlerDueDate();
	const listOfDates = handlerDueDate.generateDueDates(
		dueDay,
		dueDay - 1,
		invoices.length,
		false
	);
	const dueDates = listOfDates.map((dates) => dates.dueDate);


	const installmentValue = (purchaseValue/totalInstalments).toFixed(2);
	const totalInstallmentsToCreate = invoices.length;
	const installmentNumber = (totalInstalments - totalInstallmentsToCreate) + 1;
	const listInstallmentsToCrerate: Installment[] = [];


	for(let i = 0; i < totalInstallmentsToCreate; i++){
		listInstallmentsToCrerate.push({
			installmentNumber: installmentNumber + i,
			installmentValue: Decimal(installmentValue),
			dueDate: dueDates[i],
			shoppingId: shoppingId,
			invoiceId: invoices[i].id,
		});
	}


	const installments = await installmentRepository.create(listInstallmentsToCrerate);


	return {
		installments,
		listInstallmentsToCrerate
	};
}
