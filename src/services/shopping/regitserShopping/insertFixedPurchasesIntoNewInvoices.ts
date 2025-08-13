import { Installment } from "src/@types/customTypes";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { Invoice } from "@/generated/prisma/client";


export async function insertFixedPurchasesIntoNewInvoices(
	userId: string,
	invoices: Invoice[],
	shoppingRepository: ShoppingDatabaseInterface,
	installmentRepository: InstallmentDatabaseInterface
){

	const handlerDueDate = new HandlerDueDate();
	const newInstallments: Installment[] = [];
	const shoppingFroUpdate: string[] = [];


	const fixedPurchases = await shoppingRepository.findFixedTypeOpenPurchases(userId);

	if(fixedPurchases.length === 0){
		return {
			installments: [],
			newInstallments: [],
			updateShopping: 0
		};
	}
            

	fixedPurchases.forEach((purchase) => {

		const lastPosition = purchase.installment.length - 1;
		const installmentValue = purchase.installment[lastPosition].installmentValue;
		let numberOfTheLastInstallmetCreated = purchase.installment[lastPosition].installmentNumber;

		const dueDay = purchase.installment[lastPosition].dueDate.getDate();
		let month = purchase.installment[lastPosition].dueDate.getMonth();
		let year = purchase.installment[lastPosition].dueDate.getFullYear();


		invoices.forEach((invoice) => {

			month += 1;

			if(month > 11){
				year += 1;
				month = 0;
			}
			
			const dueDate = handlerDueDate.formatDate(year, month, dueDay);
			numberOfTheLastInstallmetCreated += 1;
  
			newInstallments.push({
				installmentNumber: numberOfTheLastInstallmetCreated,
				installmentValue: installmentValue,
				dueDate: dueDate,
				shoppingId: purchase.id,
				invoiceId: invoice.id,
			});
		});

		shoppingFroUpdate.push(purchase.id);
	});


	const [installments] = await Promise.all([
	    installmentRepository.create(newInstallments)
	]);

    
	return {
		installments,
		newInstallments,
		shoppingFroUpdate
	};
}