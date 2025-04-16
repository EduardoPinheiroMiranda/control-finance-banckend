import { Installment } from "@/@types/customTypes";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { Invoice } from "@prisma/client";


export async function insertFixedPurchasesIntoNewInvoices(
	userId: string,
	invoices: Invoice[],
	shoppingRepository: ShoppingDatabaseInterface,
	installmentRepository: InstallmentDatabaseInterface
){

	const handlerDueDate = new HandlerDueDate();
	const newInstallments: Installment[] = [];
	const shoppingFroUpdate: string[] = [];


	const fixedPurchases = await shoppingRepository.findFixedTypeOpenPurchase(userId);

	if(fixedPurchases.length === 0){
		return {
			installments: [],
			newInstallments: [],
			updateShopping: 0
		};
	}
            

	fixedPurchases.forEach((purchase) => {

		const lastPosition = purchase.installment.length - 1;
		const installmentValue = purchase.installment[lastPosition].installment_value;
		let numberOfTheLastInstallmetCreated = purchase.installment[lastPosition].installment_number;

		const dueDay = purchase.installment[lastPosition].due_date.getDate();
		let month = purchase.installment[lastPosition].due_date.getMonth();
		let year = purchase.installment[lastPosition].due_date.getFullYear();


		invoices.forEach((invoice) => {

			month += 1;

			if(month > 11){
				year += 1;
				month = 0;
			}
			
			const dueDate = handlerDueDate.formatDate(year, month, dueDay);
			numberOfTheLastInstallmetCreated += 1;
  
			newInstallments.push({
				installment_number: numberOfTheLastInstallmetCreated,
				installment_value: installmentValue,
				due_date: dueDate,
				shopping_id: purchase.id,
				invoice_id: invoice.id,
			});
		});

		shoppingFroUpdate.push(purchase.id);
	});


	const [installments, updateShopping] = await Promise.all([
	    installmentRepository.create(newInstallments),
		shoppingRepository.updateTotalInstallments(shoppingFroUpdate, invoices.length)
	]);

    
	return {
		installments,
		newInstallments,
		updateShopping,
		shoppingFroUpdate
	};
}